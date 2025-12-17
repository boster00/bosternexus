-- Remove refresh_token column from auth_tokens table
-- Refresh tokens are now stored as separate rows with type='oauth_refresh'
-- This migration removes the deprecated refresh_token column

-- Drop the column
ALTER TABLE auth_tokens 
  DROP COLUMN IF EXISTS refresh_token;

-- Update the comment to reflect that refresh tokens are stored as separate rows
COMMENT ON TABLE auth_tokens IS 'Stores authentication tokens for various vendors and services. OAuth access and refresh tokens are stored as separate rows with type=oauth_access and type=oauth_refresh respectively.';
