-- Update bic_articles table to support wiki articles with full metadata
-- Add fields for category, tags, owners, last_reviewed, order, source_urls

-- Add new columns for wiki metadata
ALTER TABLE bic_articles 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS owners JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_reviewed DATE,
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 999,
  ADD COLUMN IF NOT EXISTS source_urls JSONB DEFAULT '[]'::jsonb;

-- Add index for category (for navigation grouping)
CREATE INDEX IF NOT EXISTS idx_bic_articles_category ON bic_articles(category);

-- Add index for tags (for tag filtering)
CREATE INDEX IF NOT EXISTS idx_bic_articles_tags ON bic_articles USING GIN(tags);

-- Update comments
COMMENT ON COLUMN bic_articles.category IS 'Category for navigation grouping';
COMMENT ON COLUMN bic_articles.tags IS 'Array of tags for filtering';
COMMENT ON COLUMN bic_articles.owners IS 'Array of owner emails/names';
COMMENT ON COLUMN bic_articles.last_reviewed IS 'Date when article was last reviewed';
COMMENT ON COLUMN bic_articles."order" IS 'Display order within category';
COMMENT ON COLUMN bic_articles.source_urls IS 'Array of source document URLs';

