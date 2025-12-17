-- Create auth_tokens table
-- This table stores authentication tokens for various vendors and services

CREATE TABLE IF NOT EXISTS auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('oauth', 'api_key', 'bearer', 'refresh', 'session', 'custom')),
  vendor TEXT NOT NULL,
  token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  
  -- Constraints
  CONSTRAINT valid_expires_at CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_tokens_vendor ON auth_tokens(vendor);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_type ON auth_tokens(type);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_vendor_type_active ON auth_tokens(vendor, type, is_active);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_tokens(expires_at) WHERE expires_at IS NOT NULL;

-- Create unique index for active tokens (vendor, type, user_id combination)
CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_tokens_vendor_type_unique 
  ON auth_tokens(vendor, type, user_id) 
  WHERE is_active = true;

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_auth_tokens_updated_at
  BEFORE UPDATE ON auth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Users can view their own tokens
CREATE POLICY "Users can view their own tokens"
  ON auth_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tokens
CREATE POLICY "Users can insert their own tokens"
  ON auth_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tokens
CREATE POLICY "Users can update their own tokens"
  ON auth_tokens
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own tokens
CREATE POLICY "Users can delete their own tokens"
  ON auth_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access"
  ON auth_tokens
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comment to table
COMMENT ON TABLE auth_tokens IS 'Stores authentication tokens for various vendors and services (Zoho, Stripe, etc.)';
COMMENT ON COLUMN auth_tokens.type IS 'Type of token: oauth, api_key, bearer, refresh, session, or custom';
COMMENT ON COLUMN auth_tokens.vendor IS 'Vendor/service name (e.g., zoho_books, zoho_crm, stripe, google)';
COMMENT ON COLUMN auth_tokens.token IS 'The actual token value (should be encrypted at application level)';
COMMENT ON COLUMN auth_tokens.refresh_token IS 'Refresh token for OAuth flows';
COMMENT ON COLUMN auth_tokens.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN auth_tokens.user_id IS 'User who owns this token (nullable for system-level tokens)';
COMMENT ON COLUMN auth_tokens.metadata IS 'Additional metadata as JSON (e.g., scopes, permissions, etc.)';
COMMENT ON COLUMN auth_tokens.is_active IS 'Whether the token is currently active';
COMMENT ON COLUMN auth_tokens.description IS 'Human-readable description of the token';
