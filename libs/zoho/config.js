/**
 * Zoho OAuth Configuration
 * 
 * Centralized configuration for Zoho OAuth flows across all services.
 * 
 * IMPORTANT: Zoho OAuth tokens are SHARED across all services (Books, CRM, Desk).
 * When you authenticate with Zoho, you receive ONE set of tokens that work for all services.
 * The service parameter is used only for client credentials (client_id/client_secret)
 * and for storing metadata, but the tokens themselves are universal.
 */

const ZOHO_AUTH_BASE_URL = 'https://accounts.zoho.com/oauth/v2';
const ZOHO_TOKEN_URL = `${ZOHO_AUTH_BASE_URL}/token`;
const ZOHO_REVOKE_URL = `${ZOHO_AUTH_BASE_URL}/revoke`;

/**
 * Get OAuth authorization URL for a service
 * @param {string} service - 'books', 'crm', or 'desk'
 * @param {string} redirectUri - OAuth callback URL
 * @param {string} state - State parameter for CSRF protection
 * @returns {string} Authorization URL
 */
export function getAuthUrl(service, redirectUri, state) {
  const clientId = getClientId(service);
  const scopes = getScopes(service);
  
  const params = new URLSearchParams({
    client_id: clientId,
    scope: scopes.join(','),
    response_type: 'code',
    access_type: 'offline',
    redirect_uri: redirectUri,
    state: state,
    prompt: 'consent', // Always prompt for consent to ensure refresh token is provided
  });

  return `${ZOHO_AUTH_BASE_URL}/auth?${params.toString()}`;
}

/**
 * Get client ID for a service
 * @param {string} service - 'books', 'crm', or 'desk'
 * @returns {string} Client ID
 */
export function getClientId(service) {
  const envVar = `ZOHO_${service.toUpperCase()}_CLIENT_ID`;
  const clientId = process.env[envVar];
  
  if (!clientId) {
    throw new Error(`Missing ${envVar} environment variable`);
  }
  
  return clientId;
}

/**
 * Get client secret for a service
 * @param {string} service - 'books', 'crm', or 'desk'
 * @returns {string} Client secret
 */
export function getClientSecret(service) {
  const envVar = `ZOHO_${service.toUpperCase()}_CLIENT_SECRET`;
  const clientSecret = process.env[envVar];
  
  if (!clientSecret) {
    throw new Error(`Missing ${envVar} environment variable`);
  }
  
  return clientSecret;
}

/**
 * Get required OAuth scopes for Zoho
 * Note: Zoho OAuth covers all products with a single authorization
 * This comprehensive scope list covers all Zoho services
 * @param {string} service - 'books', 'crm', or 'desk' (kept for compatibility, but all services use same scopes)
 * @returns {string[]} Array of scope strings
 */
export function getScopes(service) {
  // Comprehensive scope list covering all Zoho services
  // Since Zoho OAuth covers all products, we use the same scopes for all services
  return [
    'ZohoBooks.fullaccess.all',
    'ZohoCRM.send_mail.all.CREATE',
    'ZohoCRM.modules.ALL',
    'ZohoCRM.settings.ALL',
    'ZohoCRM.templates.All',
    'ZohoCRM.Files.READ',
    'ZohoCRM.Files.CREATE',
    // 'ZohoCalendar.event.ALL',
    'Desk.tickets.ALL',
    'Desk.contacts.ALL',
    'Desk.search.READ',
    // 'SalesIQ.visitordetails.ALL',
    // 'SalesIQ.conversations.ALL',
    // 'SalesIQ.visitors.ALL',
    'ZohoMail.messages.ALL',
    'ZohoMail.accounts.READ',
    // 'ZohoCampaigns.contact.ALL',
    // 'ZohoCampaigns.mailinglists.ALL',

    
  ];
}

/**
 * Get redirect URI for OAuth callback
 * Note: Zoho OAuth uses a single callback URL for all services
 * @param {string} baseUrl - Base URL of the application (e.g., http://localhost:3000)
 * @returns {string} Redirect URI
 */
export function getRedirectUri(baseUrl) {
  return `${baseUrl}/api/zoho/auth/callback`;
}

/**
 * Get token URL for exchanging authorization code
 * @returns {string} Token URL
 */
export function getTokenUrl() {
  return ZOHO_TOKEN_URL;
}

/**
 * Get revoke URL for revoking tokens
 * @returns {string} Revoke URL
 */
export function getRevokeUrl() {
  return ZOHO_REVOKE_URL;
}

/**
 * Base URLs for Zoho API services
 * 
 * Note: Zoho has migrated to zohoapis.com domain for API requests.
 * Region-specific domains are available (e.g., .eu, .in, .com.au, .jp, .ca, .sa, .com.cn)
 * Default is US region (.com). Override via environment variables if needed.
 */
export const baseUrls = {
  // Zoho Books: Updated to use zohoapis.com domain (mandatory as of June 2024)
  books: process.env.ZOHO_BOOKS_API_URL || 'https://www.zohoapis.com/books/v3',
  // Zoho CRM: Already using correct zohoapis.com domain
  crm: process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2',
  // Zoho Desk: Still uses desk.zoho.com domain (verify if this needs updating)
  desk: process.env.ZOHO_DESK_API_URL || 'https://desk.zoho.com/api/v1',
};
