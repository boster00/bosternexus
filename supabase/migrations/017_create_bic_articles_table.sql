-- Create bic_articles table for Boster Info Center wiki pages
-- Stores critical and sensitive information with access control

CREATE TABLE IF NOT EXISTS bic_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE, -- Slug URL (e.g., 'company-info', 'tax-ids')
  html_content TEXT NOT NULL DEFAULT '',
  is_whitelist_only BOOLEAN NOT NULL DEFAULT false, -- If true, only whitelisted users can access
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by url (slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bic_articles_url ON bic_articles(url);

-- Index for faster lookups by creator
CREATE INDEX IF NOT EXISTS idx_bic_articles_created_by ON bic_articles(created_by);

-- Index for filtering by whitelist status
CREATE INDEX IF NOT EXISTS idx_bic_articles_whitelist_only ON bic_articles(is_whitelist_only);

-- Add comments
COMMENT ON TABLE bic_articles IS 'Boster Info Center wiki articles with access control';
COMMENT ON COLUMN bic_articles.name IS 'Display name for the article';
COMMENT ON COLUMN bic_articles.url IS 'URL slug (unique, e.g., company-info)';
COMMENT ON COLUMN bic_articles.html_content IS 'HTML content of the article';
COMMENT ON COLUMN bic_articles.is_whitelist_only IS 'If true, only whitelisted users (CJ_WHITELIST) can access';
COMMENT ON COLUMN bic_articles.created_by IS 'User who created the article';

-- Enable RLS
ALTER TABLE bic_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can view non-whitelist articles
-- Whitelist-only articles are controlled at application level (env var CJ_WHITELIST)
CREATE POLICY "Authenticated users can view public articles"
  ON bic_articles FOR SELECT
  USING (
    auth.role() = 'authenticated' AND 
    (is_whitelist_only = false OR created_by = auth.uid())
  );

-- RLS Policy: All authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
  ON bic_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- RLS Policy: Users can update articles they created
CREATE POLICY "Users can update their own articles"
  ON bic_articles FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- RLS Policy: Users can delete articles they created
CREATE POLICY "Users can delete their own articles"
  ON bic_articles FOR DELETE
  USING (auth.uid() = created_by);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bic_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_bic_articles_updated_at
  BEFORE UPDATE ON bic_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_bic_articles_updated_at();

