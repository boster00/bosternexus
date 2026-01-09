/**
 * Whitelist utility for checking CJ_WHITELIST access
 * Used for Boster Info Center articles that require whitelist-only access
 */

/**
 * Check if a user email is whitelisted
 * @param {string} userEmail - User's email address
 * @returns {boolean} - True if user is whitelisted
 */
export function isUserWhitelisted(userEmail) {
  if (!userEmail) {
    return false;
  }

  // Get whitelist from environment variable
  // Format: "info@,boster@,services@" (comma-separated)
  const whitelistEnv = process.env.CJ_WHITELIST || 'info@,boster@,services@';
  
  // Split by comma and trim whitespace
  const whitelistEmails = whitelistEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);

  // Check if user's email matches any whitelist pattern
  // Supports both exact matches and domain matches (e.g., "info@" matches "info@bosterbio.com")
  const userEmailLower = userEmail.toLowerCase();
  
  return whitelistEmails.some(whitelistPattern => {
    // Exact match
    if (userEmailLower === whitelistPattern) {
      return true;
    }
    
    // Domain match (e.g., "info@" matches "info@bosterbio.com")
    if (whitelistPattern.endsWith('@') && userEmailLower.startsWith(whitelistPattern)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Check if user has access to a whitelist-only article
 * @param {string} userEmail - User's email address
 * @param {boolean} isWhitelistOnly - Whether the article requires whitelist access
 * @returns {boolean} - True if user has access
 */
export function hasArticleAccess(userEmail, isWhitelistOnly) {
  // If article is not whitelist-only, all authenticated users have access
  if (!isWhitelistOnly) {
    return true;
  }
  
  // If article is whitelist-only, check whitelist
  return isUserWhitelisted(userEmail);
}

