-- Create zoho_books_items table
-- This table caches Zoho Books items data for faster access and reporting

CREATE TABLE IF NOT EXISTS zoho_books_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  zcrm_product_id TEXT,
  description TEXT,
  rate NUMERIC(15, 2),
  purchase_description TEXT,
  purchase_rate NUMERIC(15, 2),
  item_type TEXT NOT NULL,
  product_type TEXT NOT NULL,
  stock_on_hand INTEGER DEFAULT 0,
  available_stock INTEGER DEFAULT 0,
  actual_available_stock INTEGER DEFAULT 0,
  sku TEXT,
  reorder_level INTEGER,
  can_be_sold BOOLEAN DEFAULT false,
  can_be_purchased BOOLEAN DEFAULT false,
  track_inventory BOOLEAN DEFAULT false,
  is_linked_with_zohocrm BOOLEAN DEFAULT false,
  created_time TIMESTAMPTZ,
  last_modified_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_rate CHECK (rate IS NULL OR rate >= 0),
  CONSTRAINT valid_purchase_rate CHECK (purchase_rate IS NULL OR purchase_rate >= 0),
  CONSTRAINT valid_stock CHECK (stock_on_hand IS NULL OR stock_on_hand >= 0),
  CONSTRAINT valid_available_stock CHECK (available_stock IS NULL OR available_stock >= 0),
  CONSTRAINT valid_actual_available_stock CHECK (actual_available_stock IS NULL OR actual_available_stock >= 0),
  CONSTRAINT valid_reorder_level CHECK (reorder_level IS NULL OR reorder_level >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_zoho_id ON zoho_books_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_status ON zoho_books_items(status);
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_sku ON zoho_books_items(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_zcrm_product_id ON zoho_books_items(zcrm_product_id) WHERE zcrm_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_synced_at ON zoho_books_items(synced_at);
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_item_type ON zoho_books_items(item_type);
CREATE INDEX IF NOT EXISTS idx_zoho_books_items_product_type ON zoho_books_items(product_type);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_zoho_books_items_updated_at
  BEFORE UPDATE ON zoho_books_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE zoho_books_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Authenticated users can read items
CREATE POLICY "Authenticated users can read items"
  ON zoho_books_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access"
  ON zoho_books_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comments
COMMENT ON TABLE zoho_books_items IS 'Cached Zoho Books items data. Synced from Zoho Books API.';
COMMENT ON COLUMN zoho_books_items.zoho_id IS 'Zoho Books item ID (unique identifier from Zoho)';
COMMENT ON COLUMN zoho_books_items.synced_at IS 'Timestamp when this record was last synced from Zoho';
COMMENT ON COLUMN zoho_books_items.zcrm_product_id IS 'Linked Zoho CRM product ID if item is linked with CRM';
