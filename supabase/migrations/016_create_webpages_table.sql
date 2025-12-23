-- Create webpages table for storing user-created webpage drafts
-- Each user can create and manage their own webpages

CREATE TABLE IF NOT EXISTS webpages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url_key TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: each user can have unique url_key
CREATE UNIQUE INDEX IF NOT EXISTS idx_webpages_user_url_key ON webpages(user_id, url_key);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_webpages_user_id ON webpages(user_id);

-- Index for faster lookups by url_key
CREATE INDEX IF NOT EXISTS idx_webpages_url_key ON webpages(url_key);

-- Add comments
COMMENT ON TABLE webpages IS 'User-created webpage drafts with HTML content';
COMMENT ON COLUMN webpages.user_id IS 'Owner of the webpage';
COMMENT ON COLUMN webpages.name IS 'Display name for the webpage';
COMMENT ON COLUMN webpages.url_key IS 'URL-friendly identifier (unique per user)';
COMMENT ON COLUMN webpages.html_content IS 'Full HTML content of the webpage';

-- Enable RLS
ALTER TABLE webpages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only select their own webpages
CREATE POLICY "Users can view their own webpages"
  ON webpages FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own webpages
CREATE POLICY "Users can create their own webpages"
  ON webpages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own webpages
CREATE POLICY "Users can update their own webpages"
  ON webpages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own webpages
CREATE POLICY "Users can delete their own webpages"
  ON webpages FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webpages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_webpages_updated_at
  BEFORE UPDATE ON webpages
  FOR EACH ROW
  EXECUTE FUNCTION update_webpages_updated_at();
