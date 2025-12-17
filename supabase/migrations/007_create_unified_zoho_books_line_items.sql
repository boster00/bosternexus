-- Create unified zoho_books_line_items table
-- This replaces the 4 separate line item tables (invoice_items, salesorder_items, purchaseorder_items, bill_items)
-- Uses parent_id (UUID) and parent_type (enum) to reference parent transactions

-- Drop old tables if they exist (will be done in a separate migration after data migration)
-- For now, we'll create the new table alongside the old ones

CREATE TABLE IF NOT EXISTS zoho_books_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,  -- UUID of parent transaction (invoice, salesorder, purchaseorder, or bill)
  parent_type TEXT NOT NULL CHECK (parent_type IN ('invoice', 'salesorder', 'purchaseorder', 'bill')),
  zoho_id TEXT NOT NULL,
  item_id TEXT,
  sku TEXT,
  name TEXT,
  description TEXT,
  quantity NUMERIC(15, 4),
  rate NUMERIC(15, 2),
  total NUMERIC(15, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_quantity CHECK (quantity IS NULL OR quantity >= 0),
  CONSTRAINT valid_rate CHECK (rate IS NULL OR rate >= 0),
  CONSTRAINT valid_total CHECK (total IS NULL OR total >= 0),
  -- Ensure unique zoho_id per parent transaction
  CONSTRAINT unique_line_item_per_parent UNIQUE (parent_id, parent_type, zoho_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_zoho_books_line_items_parent ON zoho_books_line_items(parent_type, parent_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_line_items_zoho_id ON zoho_books_line_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_line_items_item_id ON zoho_books_line_items(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_line_items_sku ON zoho_books_line_items(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_line_items_parent_type ON zoho_books_line_items(parent_type);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_zoho_books_line_items_updated_at
  BEFORE UPDATE ON zoho_books_line_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE zoho_books_line_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Authenticated users can read line items
CREATE POLICY "Authenticated users can read line items"
  ON zoho_books_line_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access to line items"
  ON zoho_books_line_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comment
COMMENT ON TABLE zoho_books_line_items IS 'Unified line items table for all Zoho Books transactions (invoices, salesorders, purchaseorders, bills). Uses parent_id and parent_type to reference parent transactions.';
