/**
 * Zoho API Client Class
 * 
 * Centralized class for all Zoho API operations (Books, CRM, Desk).
 * This class handles authentication, rate limiting, and provides methods
 * for interacting with all Zoho services.
 * 
 * ⚠️ CRITICAL: All Zoho API operations MUST use this class.
 * Never make direct fetch/axios calls to Zoho APIs.
 */

import { ZohoRateLimiter } from "./rate-limiter";
import { baseUrls } from "./config";
import { ZohoAuthService } from "./auth";

class Zoho {
  constructor() {
    this.rateLimiter = new ZohoRateLimiter();
    this.baseUrls = baseUrls;
    this.authService = new ZohoAuthService();
    /**
     * In-memory cache for access tokens.
     * Keyed by user context (system-level vs user-specific).
     * Since Zoho tokens are shared across services, we don't need
     * separate cache entries per service.
     * 
     * Map key format: userId || 'system'
     * Map value: { accessToken: string, expiresAt: number|null }
     */
    this.tokenCache = new Map();
    
    // Legacy credentials from environment variables (fallback)
    this.credentials = {
      books: {
        clientId: process.env.ZOHO_BOOKS_CLIENT_ID,
        clientSecret: process.env.ZOHO_BOOKS_CLIENT_SECRET,
        accessToken: process.env.ZOHO_BOOKS_ACCESS_TOKEN,
        refreshToken: process.env.ZOHO_BOOKS_REFRESH_TOKEN,
        organizationId: process.env.ZOHO_BOOKS_ORGANIZATION_ID,
      },
      crm: {
        clientId: process.env.ZOHO_CRM_CLIENT_ID,
        clientSecret: process.env.ZOHO_CRM_CLIENT_SECRET,
        accessToken: process.env.ZOHO_CRM_ACCESS_TOKEN,
        refreshToken: process.env.ZOHO_CRM_REFRESH_TOKEN,
      },
      desk: {
        clientId: process.env.ZOHO_DESK_CLIENT_ID,
        clientSecret: process.env.ZOHO_DESK_CLIENT_SECRET,
        accessToken: process.env.ZOHO_DESK_ACCESS_TOKEN,
        refreshToken: process.env.ZOHO_DESK_REFRESH_TOKEN,
        orgId: process.env.ZOHO_DESK_ORG_ID,
      },
    };
  }

  /**
   * Build cache key for token cache
   * @param {string|null} userId 
   * @returns {string}
   */
  _getTokenCacheKey(userId) {
    return userId || "system";
  }

  /**
   * Get cached access token if present and not expired
   * @param {string|null} userId 
   * @returns {string|null} Returns null if not cached or expired (cache is cleared)
   */
  _getCachedAccessToken(userId) {
    const cacheKey = this._getTokenCacheKey(userId);
    const cached = this.tokenCache.get(cacheKey);
    if (!cached || !cached.accessToken) {
      return null;
    }

    // If we have an expiration time, enforce it with a small safety margin
    if (cached.expiresAt) {
      const now = Date.now();
      const safetyMarginMs = 60 * 1000; // 60 seconds safety margin
      if (cached.expiresAt - safetyMarginMs <= now) {
        // Token is expired or about to expire, clear cache
        // This signals to getAccessToken that it should refresh
        this.tokenCache.delete(cacheKey);
        return null;
      }
    }

    return cached.accessToken;
  }

  /**
   * Store access token in cache
   * @param {string|null} userId 
   * @param {string} accessToken 
   * @param {Date|string|null} expiresAt 
   */
  _setCachedAccessToken(userId, accessToken, expiresAt = null) {
    const cacheKey = this._getTokenCacheKey(userId);
    let expiresAtMs = null;

    if (expiresAt) {
      // Accept Date instance or ISO/string
      const expiresDate =
        expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
      if (!isNaN(expiresDate.getTime())) {
        expiresAtMs = expiresDate.getTime();
      }
    }

    this.tokenCache.set(cacheKey, {
      accessToken,
      expiresAt: expiresAtMs,
    });
  }

  /**
   * Get access token for a specific service
   * Note: Zoho OAuth tokens are SHARED across all services (books, crm, desk).
   * Automatically refreshes expired tokens using refresh token.
   * Tries database first, then falls back to environment variables.
   * @param {string} service - 'books', 'crm', or 'desk' (kept for compatibility, but tokens are shared)
   * @param {string} userId - User ID (optional, for user-specific tokens)
   * @returns {Promise<string|null>} Access token or null
   */
  async getAccessToken(service, userId = null) {
    // First, try in-memory cache (fast, avoids repeated DB calls)
    const cachedToken = this._getCachedAccessToken(userId);
    if (cachedToken) {
      return cachedToken;
    }

    // If cache was cleared due to expiration, try to refresh automatically
    const cacheKey = this._getTokenCacheKey(userId);
    const wasExpired = this.tokenCache.has(cacheKey) === false; // Cache was cleared by _getCachedAccessToken

    try {
      // Try to get token from database first
      // Note: getToken() will automatically refresh if expired, so we should get a valid token
      // Since tokens are shared, this will return the same token for any service
      const token = await this.authService.getToken(service, userId);
      
      if (token?.accessToken) {
        // Check if token is expired (getToken may have refreshed, so check again)
        const isExpired = token.expiresAt && new Date(token.expiresAt) <= new Date();
        
        if (isExpired) {
          // Token is still expired (refresh in getToken may have failed), try refreshing here
          console.log(`Token expired after getToken, attempting refresh for ${service}...`);
          try {
            const refreshedToken = await this.refreshAccessToken(service, userId);
            if (refreshedToken) {
              console.log(`Successfully refreshed expired token for ${service}`);
              return refreshedToken;
            }
          } catch (refreshError) {
            console.error(`Failed to auto-refresh expired token for ${service}:`, refreshError.message);
            console.error(`Refresh error details:`, refreshError);
            // Fall through to try env vars
          }
        } else {
          // Token is valid, cache and return it
          this._setCachedAccessToken(userId, token.accessToken, token.expiresAt);
          return token.accessToken;
        }
      }
      
      // If we get here, either no token was found or it was expired and refresh failed
      // Try to refresh anyway (might have refresh token even if access token is missing/expired)
      console.log(`No valid token found, attempting refresh for ${service}...`);
      try {
        const refreshedToken = await this.refreshAccessToken(service, userId);
        if (refreshedToken) {
          console.log(`Successfully refreshed token for ${service}`);
          return refreshedToken;
        }
      } catch (refreshError) {
        console.error(`Failed to refresh token for ${service}:`, refreshError.message);
        console.error(`Refresh error details:`, refreshError);
        // Fall through to env vars
      }
    } catch (error) {
      console.error(`Failed to get token from database for ${service}:`, error.message);
      console.error(`Error details:`, error);
      // If we have a refresh token available, try refreshing
      try {
        const refreshedToken = await this.refreshAccessToken(service, userId);
        if (refreshedToken) {
          console.log(`Successfully refreshed token after DB error for ${service}`);
          return refreshedToken;
        }
      } catch (refreshError) {
        console.error(`Failed to refresh token after DB error for ${service}:`, refreshError.message);
        console.error(`Refresh error details:`, refreshError);
        // Fall through to environment variable fallback
      }
    }

    // Fallback to environment variables (service-specific for legacy support)
    const envToken = this.credentials[service]?.accessToken || null;
    if (envToken) {
      // Cache env-based token without expiration (will be used until process restart)
      this._setCachedAccessToken(userId, envToken, null);
    }
    return envToken;
  }

  /**
   * Refresh access token for a specific service
   * Note: Zoho OAuth tokens are SHARED across all services.
   * @param {string} service - 'books', 'crm', or 'desk' (used for client credentials only)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<string>} New access token
   */
  async refreshAccessToken(service, userId = null) {
    try {
      // Try to refresh using auth service (database tokens)
      // Since tokens are shared, this refreshes the token for all services
      const token = await this.authService.refreshToken(service, userId);
      if (token?.accessToken) {
        // Update cache with new token
        this._setCachedAccessToken(userId, token.accessToken, token.expiresAt);
        return token.accessToken;
      }
    } catch (error) {
      console.warn(`Failed to refresh token from database:`, error.message);
      // Fall through to environment variable refresh
    }

    // Fallback to environment variable refresh (service-specific for legacy support)
    const creds = this.credentials[service];
    if (!creds?.refreshToken) {
      throw new Error(`No refresh token available for Zoho (tokens are shared across all services)`);
    }

    const tokenUrl = "https://accounts.zoho.com/oauth/v2/token";
    const params = new URLSearchParams({
      refresh_token: creds.refreshToken,
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      grant_type: "refresh_token",
    });

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      const data = await response.json();
      const newAccessToken = data.access_token;

      // Update the access token (in production, you might want to store this)
      this.credentials[service].accessToken = newAccessToken;

      return newAccessToken;
    } catch (error) {
      console.error(`Error refreshing ${service} token:`, error);
      throw error;
    }
  }

  /**
   * Make an authenticated API request to Zoho
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} endpoint - API endpoint (e.g., '/items', '/contacts')
   * @param {object} options - Fetch options (method, body, headers, etc.)
   * @param {string} userId - User ID (optional, for user-specific tokens)
   * @returns {Promise<Response>} Fetch response
   */
  async request(service, endpoint, options = {}, userId = null) {
    // Acquire rate limiter lock
    await this.rateLimiter.acquire();

    try {
      const baseUrl = this.baseUrls[service];
      const accessToken = await this.getAccessToken(service, userId);

      if (!accessToken) {
        throw new Error(`No access token available for Zoho (tokens are shared across all services)`);
      }

      const url = `${baseUrl}${endpoint}`;
      const headers = {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Add organization ID for Books API
      if (service === "books" && this.credentials.books.organizationId) {
        headers["X-com-zoho-books-organizationid"] =
          this.credentials.books.organizationId;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh token and retry once
        const newToken = await this.refreshAccessToken(service, userId);
        headers["Authorization"] = `Zoho-oauthtoken ${newToken}`;

        // Retry the request
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        return retryResponse;
      }

      return response;
    } finally {
      // Rate limiter automatically releases after interval
    }
  }

  /**
   * Normalize Zoho API response to extract data consistently
   * Different Zoho services return data in different formats:
   * - Books: { code, message, items: [...] } or { code, message, [module]: [...] }
   * - CRM: { data: [...] }
   * - Desk: { data: [...] } or array directly
   * 
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {object} response - Raw API response
   * @param {string} module - Module name (for Books, to determine field name)
   * @returns {object} Normalized response with data array
   */
  normalizeResponse(service, response, module = null) {
    if (service === "books") {
      // Zoho Books format: { code: 0, message: "success", items: [...] }
      // or { code: 0, message: "success", [module]: [...] } for other modules
      if (response.code === 0) {
        // Check for 'items' field (for /items endpoint)
        if (response.items && Array.isArray(response.items)) {
          return {
            ...response,
            data: response.items,
          };
        }
        // Check for module-specific field (e.g., 'invoices', 'contacts', etc.)
        if (module && response[module] && Array.isArray(response[module])) {
          return {
            ...response,
            data: response[module],
          };
        }
        // If no array found, return as-is
        return response;
      }
      // Error response
      return response;
    } else if (service === "crm") {
      // Zoho CRM format: { data: [...] }
      return response;
    } else if (service === "desk") {
      // Zoho Desk format: { data: [...] } or array directly
      if (Array.isArray(response)) {
        return { data: response };
      }
      return response;
    }
    return response;
  }

  /**
   * Make a GET request
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} JSON response (normalized)
   */
  async get(service, endpoint, params = {}, userId = null) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    const response = await this.request(
      service,
      fullEndpoint,
      {
        method: "GET",
      },
      userId
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error (${response.status}): ${errorText}`);
    }

    const jsonResponse = await response.json();
    
    // Extract module name from endpoint (e.g., "/items" -> "items")
    const moduleMatch = endpoint.match(/\/([^\/]+)(?:\/|$)/);
    const module = moduleMatch ? moduleMatch[1] : null;
    
    // Normalize response format
    return this.normalizeResponse(service, jsonResponse, module);
  }

  /**
   * Make a POST request
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} JSON response
   */
  async post(service, endpoint, data = {}, userId = null) {
    const response = await this.request(
      service,
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      userId
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Make a PUT request
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} JSON response
   */
  async put(service, endpoint, data = {}, userId = null) {
    const response = await this.request(
      service,
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      userId
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Make a DELETE request
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} endpoint - API endpoint
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} JSON response
   */
  async delete(service, endpoint, userId = null) {
    const response = await this.request(
      service,
      endpoint,
      {
        method: "DELETE",
      },
      userId
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  // ==================== ZOHO BOOKS METHODS ====================

  /**
   * Get all items from Zoho Books
   * @param {object} params - Query parameters (page, per_page, etc.)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Items response
   */
  async getBooksItems(params = {}, userId = null) {
    return this.get("books", "/items", params, userId);
  }

  /**
   * Get a specific item from Zoho Books
   * @param {string} itemId - Item ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Item response
   */
  async getBooksItem(itemId, userId = null) {
    return this.get("books", `/items/${itemId}`, {}, userId);
  }

  /**
   * Get all invoices from Zoho Books
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Invoices response
   */
  async getBooksInvoices(params = {}, userId = null) {
    return this.get("books", "/invoices", params, userId);
  }

  /**
   * Get a specific invoice from Zoho Books
   * @param {string} invoiceId - Invoice ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Invoice response
   */
  async getBooksInvoice(invoiceId, userId = null) {
    return this.get("books", `/invoices/${invoiceId}`, {}, userId);
  }

  /**
   * Get all sales orders from Zoho Books
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Sales orders response
   */
  async getBooksSalesOrders(params = {}, userId = null) {
    return this.get("books", "/salesorders", params, userId);
  }

  /**
   * Get all purchase orders from Zoho Books
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Purchase orders response
   */
  async getBooksPurchaseOrders(params = {}, userId = null) {
    return this.get("books", "/purchaseorders", params, userId);
  }

  /**
   * Get all bills from Zoho Books
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Bills response
   */
  async getBooksBills(params = {}, userId = null) {
    return this.get("books", "/bills", params, userId);
  }

  /**
   * Get inventory details from Zoho Books
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Inventory response
   */
  async getBooksInventory(params = {}, userId = null) {
    return this.get("books", "/inventory", params, userId);
  }

  // ==================== ZOHO CRM METHODS ====================

  /**
   * Get records from a Zoho CRM module
   * @param {string} module - Module name (e.g., 'Contacts', 'Leads', 'Deals')
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Records response
   */
  async getCrmRecords(module, params = {}, userId = null) {
    return this.get("crm", `/${module}`, params, userId);
  }

  /**
   * Get a specific record from Zoho CRM
   * @param {string} module - Module name
   * @param {string} recordId - Record ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Record response
   */
  async getCrmRecord(module, recordId, userId = null) {
    return this.get("crm", `/${module}/${recordId}`, {}, userId);
  }

  /**
   * Create a record in Zoho CRM
   * @param {string} module - Module name
   * @param {object} data - Record data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Created record response
   */
  async createCrmRecord(module, data, userId = null) {
    return this.post("crm", `/${module}`, { data: [data] }, userId);
  }

  /**
   * Update a record in Zoho CRM
   * @param {string} module - Module name
   * @param {string} recordId - Record ID
   * @param {object} data - Updated record data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Updated record response
   */
  async updateCrmRecord(module, recordId, data, userId = null) {
    return this.put("crm", `/${module}/${recordId}`, { data: [data] }, userId);
  }

  /**
   * Delete a record from Zoho CRM
   * @param {string} module - Module name
   * @param {string} recordId - Record ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Delete response
   */
  async deleteCrmRecord(module, recordId, userId = null) {
    return this.delete("crm", `/${module}/${recordId}`, userId);
  }

  // ==================== ZOHO DESK METHODS ====================

  /**
   * Get tickets from Zoho Desk
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Tickets response
   */
  async getDeskTickets(params = {}, userId = null) {
    return this.get("desk", "/tickets", params, userId);
  }

  /**
   * Get a specific ticket from Zoho Desk
   * @param {string} ticketId - Ticket ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Ticket response
   */
  async getDeskTicket(ticketId, userId = null) {
    return this.get("desk", `/tickets/${ticketId}`, {}, userId);
  }

  /**
   * Create a ticket in Zoho Desk
   * @param {object} data - Ticket data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Created ticket response
   */
  async createDeskTicket(data, userId = null) {
    return this.post("desk", "/tickets", data, userId);
  }

  /**
   * Update a ticket in Zoho Desk
   * @param {string} ticketId - Ticket ID
   * @param {object} data - Updated ticket data
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Updated ticket response
   */
  async updateDeskTicket(ticketId, data, userId = null) {
    return this.put("desk", `/tickets/${ticketId}`, data, userId);
  }

  /**
   * Get contacts from Zoho Desk
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Contacts response
   */
  async getDeskContacts(params = {}, userId = null) {
    return this.get("desk", "/contacts", params, userId);
  }
}

// Export singleton instance
const zoho = new Zoho();
export default zoho;

// Also export the class for testing or custom instances
export { Zoho };
