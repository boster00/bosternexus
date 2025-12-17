-- Update auth_tokens type constraint to include oauth_access and oauth_refresh
-- This allows storing OAuth access and refresh tokens as separate rows

-- Drop the old constraint
ALTER TABLE auth_tokens 
  DROP CONSTRAINT IF EXISTS auth_tokens_type_check;

-- Add new constraint with additional OAuth token types
ALTER TABLE auth_tokens 
  ADD CONSTRAINT auth_tokens_type_check 
  CHECK (type IN ('oauth', 'oauth_access', 'oauth_refresh', 'api_key', 'bearer', 'refresh', 'session', 'custom'));

-- Update the comment to reflect the new types
COMMENT ON COLUMN auth_tokens.type IS 'Type of token: oauth, oauth_access, oauth_refresh, api_key, bearer, refresh, session, or custom';
