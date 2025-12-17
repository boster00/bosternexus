/**
 * Zoho Authentication Service
 * 
 * Manages Zoho OAuth tokens stored in the database.
 * Handles token retrieval, storage, refresh, and revocation.
 */

import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { getClientId, getClientSecret, getTokenUrl } from "./config";

export class ZohoAuthService {
  constructor() {
    // Use DAL with service role for token operations (bypasses RLS)
    this.dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // Tokens can be system-level (user_id = null)
      autoTimestamps: false, // We manage timestamps manually for tokens
    });
  }

  /**
   * Get active token for a service and user
   * Note: Zoho OAuth tokens are SHARED across all services (books, crm, desk).
   * Access and refresh tokens are stored as separate rows in auth_tokens table
   * with type "oauth_access" and "oauth_refresh" respectively, vendor = "zoho".
   * We retrieve any active token for vendor="zoho" regardless of service.
   * 
   * @param {string} service - 'books', 'crm', or 'desk' (kept for compatibility, but tokens are shared)
   * @param {string} userId - User ID (optional, for user-specific tokens)
   * @returns {Promise<object|null>} Token object or null if not found
   */
  async getToken(service, userId = null) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:32',message:'getToken entry',data:{service,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    const vendor = "zoho";

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:37',message:'before DAL select in getToken',data:{vendor,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    // Fetch both access and refresh tokens using DAL
    // Zoho tokens are shared across all services, so we don't filter by metadata.service
    const [accessResult, refreshResult] = await Promise.all([
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_access")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        // Handle "not found" gracefully
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching access token for ${service}:`, err);
        return { data: null, error: err };
      }),
      
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_refresh")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        // Handle "not found" gracefully
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching refresh token for ${service}:`, err);
        return { data: null, error: err };
      }),
    ]);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:91',message:'DAL select completed in getToken',data:{hasAccessResult:!!accessResult,hasRefreshResult:!!refreshResult,accessError:accessResult?.error?.message,refreshError:refreshResult?.error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const accessTokenData = accessResult.data;
    const refreshTokenData = refreshResult.data;

    // Need at least access token
    if (!accessTokenData) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:97',message:'no access token found, returning null',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return null;
    }

    // Check if access token is expired
    if (accessTokenData.expires_at) {
      const expiresAt = new Date(accessTokenData.expires_at);
      if (expiresAt < new Date()) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:117',message:'token expired, attempting refresh',data:{service,hasRefreshToken:!!refreshTokenData?.token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // Token expired, try to refresh if refresh token exists
        if (refreshTokenData?.token) {
          try {
            const refreshed = await this.refreshToken(service, userId);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:125',message:'refreshToken completed in getToken',data:{hasRefreshed:!!refreshed,hasAccessToken:!!refreshed?.accessToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            return refreshed;
          } catch (error) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:130',message:'refreshToken failed in getToken',data:{errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            console.error(`Failed to refresh expired token for ${service}:`, error);
            return null;
          }
        }
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:135',message:'no refresh token available, returning null',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return null;
      }
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:140',message:'getToken returning valid token',data:{hasAccessToken:!!accessTokenData.token,hasRefreshToken:!!refreshTokenData?.token,isExpired:accessTokenData.expires_at?new Date(accessTokenData.expires_at)<new Date():false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    return {
      accessToken: accessTokenData.token,
      refreshToken: refreshTokenData?.token || null,
      expiresAt: accessTokenData.expires_at ? new Date(accessTokenData.expires_at) : null,
      metadata: accessTokenData.metadata || {},
    };
  }

  /**
   * Save or update token for a service
   * Note: Zoho OAuth tokens are SHARED across all services.
   * Access and refresh tokens are saved as two separate rows:
   * - Access token: type = "oauth_access", vendor = "zoho"
   * - Refresh token: type = "oauth_refresh", vendor = "zoho"
   * Each user can only have one active token per (type, vendor) combination.
   * Service is stored in metadata for reference but tokens work for all services.
   * 
   * @param {string} service - 'books', 'crm', or 'desk' (used for metadata only, tokens are shared)
   * @param {string} userId - User ID (optional, null for system-level tokens)
   * @param {object} tokenData - Token data object
   * @param {string} tokenData.accessToken - Access token
   * @param {string} tokenData.refreshToken - Refresh token (optional)
   * @param {Date|string} tokenData.expiresAt - Expiration date (optional)
   * @param {object} tokenData.metadata - Additional metadata (optional)
   * @returns {Promise<object>} Saved token records (access and refresh)
   */
  async saveToken(service, userId, tokenData) {
    const vendor = "zoho";

    const expiresAtStr = tokenData.expiresAt
      ? typeof tokenData.expiresAt === "string"
        ? tokenData.expiresAt
        : tokenData.expiresAt.toISOString()
      : null;

    // Ensure service is in metadata
    const metadata = {
      service,
      ...(tokenData.metadata || {}),
    };

    // Helper function to find existing token for (vendor, type, user_id)
    // Finds the most recent token (active or inactive) to update
    const findExistingToken = async (type) => {
      const result = await this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", type)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(() => ({ data: null, error: null }));
      
      return result.data;
    };

    // Find existing tokens FIRST (before deactivating) so we can update them
    // This ensures we always update existing rows instead of creating new ones
    const [existingAccessToken, existingRefreshToken] = await Promise.all([
      findExistingToken("oauth_access"),
      tokenData.refreshToken ? findExistingToken("oauth_refresh") : Promise.resolve(null),
    ]);

    // Deactivate any OTHER active tokens (if we found an existing one, we'll reactivate it)
    // This ensures we don't violate the unique constraint on active tokens
    await Promise.all([
      this.dal.update("auth_tokens", { is_active: false }, null, {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_access")
            .eq("is_active", true);
          
          // If we found an existing token, exclude it from deactivation (we'll update it)
          if (existingAccessToken?.id) {
            q = q.neq("id", existingAccessToken.id);
          }
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
      }),
      
      this.dal.update("auth_tokens", { is_active: false }, null, {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_refresh")
            .eq("is_active", true);
          
          // If we found an existing token, exclude it from deactivation (we'll update it)
          if (existingRefreshToken?.id) {
            q = q.neq("id", existingRefreshToken.id);
          }
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
      }),
    ]);

    // Prepare access token record
    // Note: refresh_token column does not exist - refresh tokens are stored as separate rows
    const accessTokenRecord = {
      vendor,
      type: "oauth_access",
      token: tokenData.accessToken,
      expires_at: expiresAtStr,
      user_id: userId || null,
      metadata,
      is_active: true,
      description: `Zoho ${service} OAuth access token`,
    };

    // Prepare refresh token record (if provided)
    // Refresh tokens are stored as separate rows with type='oauth_refresh'
    const refreshTokenRecord = tokenData.refreshToken
      ? {
          vendor,
          type: "oauth_refresh",
          token: tokenData.refreshToken,
          expires_at: null, // Refresh tokens typically don't expire
          user_id: userId || null,
          metadata,
          is_active: true,
          description: `Zoho ${service} OAuth refresh token`,
        }
      : null;

    // Always update existing tokens if found, otherwise insert new ones
    // This ensures we replace/update old tokens instead of creating new rows
    const results = await Promise.all([
      // Update or insert access token
      existingAccessToken
        ? this.dal.update(
            "auth_tokens",
            {
              token: accessTokenRecord.token,
              expires_at: accessTokenRecord.expires_at,
              metadata: accessTokenRecord.metadata,
              is_active: true, // Reactivate the existing token
              description: accessTokenRecord.description,
            },
            { id: existingAccessToken.id }
          )
        : this.dal.insert("auth_tokens", [accessTokenRecord]),
      
      // Update or insert refresh token (if provided)
      tokenData.refreshToken
        ? existingRefreshToken
          ? this.dal.update(
              "auth_tokens",
              {
                token: refreshTokenRecord.token,
                metadata: refreshTokenRecord.metadata,
                is_active: true, // Reactivate the existing token
                description: refreshTokenRecord.description,
              },
              { id: existingRefreshToken.id }
            )
          : this.dal.insert("auth_tokens", [refreshTokenRecord])
        : Promise.resolve({ data: [], error: null }),
    ]);

    const [accessResult, refreshResult] = results;

    if (accessResult.error) {
      console.error(`Database error saving access token:`, accessResult.error);
      throw new Error(`Failed to save access token: ${accessResult.error.message}`);
    }

    if (refreshResult.error) {
      console.error(`Database error saving refresh token:`, refreshResult.error);
      throw new Error(`Failed to save refresh token: ${refreshResult.error.message}`);
    }

    // Get the saved records (from update or insert)
    // Update returns array of updated records, insert returns array of inserted records
    const savedAccessToken = accessResult.data?.[0] || null;
    const savedRefreshToken = tokenData.refreshToken ? (refreshResult.data?.[0] || null) : null;

    console.log(
      existingAccessToken || existingRefreshToken
        ? `Updated existing token record(s) for user ${userId || 'null'}`
        : `Inserted new token record(s) for user ${userId || 'null'}`,
      {
        vendor,
        service,
        updatedAccess: !!existingAccessToken,
        updatedRefresh: !!existingRefreshToken,
      }
    );

    // Return both records
    return {
      accessToken: savedAccessToken,
      refreshToken: savedRefreshToken,
    };
  }

  /**
   * Refresh access token for a service
   * Note: Since Zoho tokens are shared, we can refresh using any service's credentials
   * @param {string} service - 'books', 'crm', or 'desk' (used for client credentials only)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} New token object
   */
  async refreshToken(service, userId = null) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:285',message:'refreshToken entry',data:{service,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Get existing tokens directly from database to avoid infinite recursion
    // (getToken would try to refresh again if token is expired, causing a loop)
    const vendor = "zoho";
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:293',message:'before DAL select in refreshToken',data:{vendor,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    const [accessResult, refreshResult] = await Promise.all([
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_access")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching access token for refresh:`, err);
        return { data: null, error: err };
      }),
      
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_refresh")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching refresh token for refresh:`, err);
        return { data: null, error: err };
      }),
    ]);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:340',message:'DAL select completed in refreshToken',data:{hasAccessResult:!!accessResult,hasRefreshResult:!!refreshResult,hasRefreshToken:!!refreshResult?.data?.token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    const refreshTokenData = refreshResult.data;
    const accessTokenData = accessResult.data;
    
    if (!refreshTokenData?.token) {
      throw new Error(`No refresh token available for Zoho (tokens are shared across all services)`);
    }
    
    const existingToken = {
      accessToken: accessTokenData?.token || null,
      refreshToken: refreshTokenData.token,
      expiresAt: accessTokenData?.expires_at ? new Date(accessTokenData.expires_at) : null,
      metadata: accessTokenData?.metadata || {},
    };

    const clientId = getClientId(service);
    const clientSecret = getClientSecret(service);
    const tokenUrl = getTokenUrl();

    const params = new URLSearchParams({
      refresh_token: existingToken.refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
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
        const errorText = await response.text();
        throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const newAccessToken = data.access_token;
      const expiresIn = data.expires_in || 3600; // Default to 1 hour if not provided
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Update only the access token row (refresh token stays the same)
      // Note: service will be automatically added to metadata in saveToken
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:380',message:'before saveToken in refreshToken',data:{service,hasRefreshToken:!!existingToken.refreshToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      await this.saveToken(service, userId, {
        accessToken: newAccessToken,
        refreshToken: existingToken.refreshToken, // Refresh token usually stays the same
        expiresAt,
        metadata: {
          ...existingToken.metadata,
          last_refreshed: new Date().toISOString(),
        },
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:395',message:'refreshToken returning',data:{hasAccessToken:!!newAccessToken,hasRefreshToken:!!existingToken.refreshToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      return {
        accessToken: newAccessToken,
        refreshToken: existingToken.refreshToken,
        expiresAt,
      };
    } catch (error) {
      console.error(`Error refreshing ${service} token:`, error);
      throw error;
    }
  }

  /**
   * Revoke and deactivate token for a service
   * Note: Since Zoho tokens are shared, revoking for any service revokes for all services
   * @param {string} service - 'books', 'crm', or 'desk' (kept for compatibility)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<boolean>} Success status
   */
  async revokeToken(service, userId = null) {
    const vendor = "zoho";

    // Get token before revoking (to revoke on Zoho's side)
    // Since tokens are shared, we get any active token
    const token = await this.getToken(service, userId);
    
    if (token && token.refreshToken) {
      // Optionally revoke on Zoho's side
      try {
        // Use the service's client credentials for revocation
        const clientId = getClientId(service);
        const clientSecret = getClientSecret(service);
        const revokeUrl = "https://accounts.zoho.com/oauth/v2/revoke";

        const params = new URLSearchParams({
          token: token.refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        });

        await fetch(revokeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
      } catch (error) {
        console.error(`Failed to revoke token on Zoho's side:`, error);
        // Continue with local revocation even if remote revocation fails
      }
    }

    // Deactivate both access and refresh tokens in database using DAL
    // Since tokens are shared, we deactivate ALL active tokens for this user/vendor
    const [accessResult, refreshResult] = await Promise.all([
      this.dal.update("auth_tokens", { is_active: false }, null, {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_access")
            .eq("is_active", true);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
      }),
      
      this.dal.update("auth_tokens", { is_active: false }, null, {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_refresh")
            .eq("is_active", true);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
      }),
    ]);

    if (accessResult.error || refreshResult.error) {
      const error = accessResult.error || refreshResult.error;
      throw new Error(`Failed to revoke token: ${error.message}`);
    }

    return true;
  }

  /**
   * Get token status for a service (without attempting refresh)
   * This method only checks the database, it does NOT attempt to refresh expired tokens
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Token status object
   */
  async getTokenStatus(service, userId = null) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:426',message:'getTokenStatus entry',data:{service,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    const vendor = "zoho";

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:430',message:'before DAL select calls',data:{vendor,userId:userId||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    // Fetch access and refresh tokens using DAL
    const [accessResult, refreshResult] = await Promise.all([
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_access")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching access token for status check:`, err);
        return { data: null, error: err };
      }),
      
      this.dal.select("auth_tokens", {
        queryBuilder: (query) => {
          let q = query
            .eq("vendor", vendor)
            .eq("type", "oauth_refresh")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (userId) {
            q = q.eq("user_id", userId);
          } else {
            q = q.is("user_id", null);
          }
          
          return q;
        },
        single: true,
      }).catch(err => {
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
          return { data: null, error: null };
        }
        console.error(`Error fetching refresh token for status check:`, err);
        return { data: null, error: err };
      }),
    ]);

    const accessTokenData = accessResult.data;
    const refreshTokenData = refreshResult.data;

    if (!accessTokenData) {
      return {
        exists: false,
        isActive: false,
        isExpired: false,
        hasRefreshToken: false,
      };
    }

    // Check expiration without attempting refresh
    const expiresAt = accessTokenData.expires_at ? new Date(accessTokenData.expires_at) : null;
    const isExpired = expiresAt ? expiresAt < new Date() : false;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:500',message:'getTokenStatus returning',data:{exists:true,isExpired,hasRefreshToken:!!refreshTokenData?.token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    return {
      exists: true,
      isActive: true,
      isExpired,
      hasRefreshToken: !!refreshTokenData?.token,
      expiresAt: expiresAt,
    };
  }

  /**
   * Exchange authorization code for tokens
   * @param {string} service - 'books', 'crm', or 'desk'
   * @param {string} code - Authorization code from OAuth callback
   * @param {string} redirectUri - Redirect URI used in authorization
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Token data
   */
  async exchangeCodeForTokens(service, code, redirectUri, userId = null) {
    const clientId = getClientId(service);
    const clientSecret = getClientSecret(service);
    const tokenUrl = getTokenUrl();

    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
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
        const errorText = await response.text();
        throw new Error(`Failed to exchange code for tokens: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresIn = data.expires_in || 3600;
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Save tokens to database
      // Note: service will be automatically added to metadata in saveToken
      console.log(`Saving tokens to database for service: ${service}, userId: ${userId || 'null'}`);
      try {
        await this.saveToken(service, userId, {
          accessToken,
          refreshToken,
          expiresAt,
          metadata: {
            scope: data.scope || "",
            token_type: data.token_type || "Bearer",
            created_at: new Date().toISOString(),
          },
        });
        console.log(`Successfully saved tokens to database for service: ${service}`);
      } catch (saveError) {
        console.error(`Failed to save tokens to database:`, saveError);
        throw new Error(`Failed to save tokens: ${saveError.message}`);
      }

      return {
        accessToken,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      console.error(`Error exchanging code for tokens:`, error);
      throw error;
    }
  }
}
