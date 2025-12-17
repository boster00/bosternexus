-- Create zoho_books_line_items tables
-- These tables store line items for Zoho Books transactions

-- Invoice Items table
CREATE TABLE IF NOT EXISTS zoho_books_invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  related_invoice_id UUID NOT NULL REFERENCES zoho_books_invoices(id) ON DELETE CASCADE,
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
  -- Ensure unique zoho_id per invoice
  CONSTRAINT unique_invoice_item_zoho_id UNIQUE (related_invoice_id, zoho_id)
);

-- Sales Order Items table
CREATE TABLE IF NOT EXISTS zoho_books_salesorder_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  related_salesorder_id UUID NOT NULL REFERENCES zoho_books_salesorders(id) ON DELETE CASCADE,
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
  -- Ensure unique zoho_id per salesorder
  CONSTRAINT unique_salesorder_item_zoho_id UNIQUE (related_salesorder_id, zoho_id)
);

-- Purchase Order Items table
CREATE TABLE IF NOT EXISTS zoho_books_purchaseorder_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  related_purchaseorder_id UUID NOT NULL REFERENCES zoho_books_purchaseorders(id) ON DELETE CASCADE,
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
  -- Ensure unique zoho_id per purchaseorder
  CONSTRAINT unique_purchaseorder_item_zoho_id UNIQUE (related_purchaseorder_id, zoho_id)
);

-- Bill Items table
CREATE TABLE IF NOT EXISTS zoho_books_bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  related_bill_id UUID NOT NULL REFERENCES zoho_books_bills(id) ON DELETE CASCADE,
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
  -- Ensure unique zoho_id per bill
  CONSTRAINT unique_bill_item_zoho_id UNIQUE (related_bill_id, zoho_id)
);

-- Create indexes for performance
-- Invoice Items
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoice_items_invoice_id ON zoho_books_invoice_items(related_invoice_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoice_items_zoho_id ON zoho_books_invoice_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoice_items_item_id ON zoho_books_invoice_items(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoice_items_sku ON zoho_books_invoice_items(sku) WHERE sku IS NOT NULL;

-- Sales Order Items
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorder_items_salesorder_id ON zoho_books_salesorder_items(related_salesorder_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorder_items_zoho_id ON zoho_books_salesorder_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorder_items_item_id ON zoho_books_salesorder_items(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorder_items_sku ON zoho_books_salesorder_items(sku) WHERE sku IS NOT NULL;

-- Purchase Order Items
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorder_items_purchaseorder_id ON zoho_books_purchaseorder_items(related_purchaseorder_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorder_items_zoho_id ON zoho_books_purchaseorder_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorder_items_item_id ON zoho_books_purchaseorder_items(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorder_items_sku ON zoho_books_purchaseorder_items(sku) WHERE sku IS NOT NULL;

-- Bill Items
CREATE INDEX IF NOT EXISTS idx_zoho_books_bill_items_bill_id ON zoho_books_bill_items(related_bill_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_bill_items_zoho_id ON zoho_books_bill_items(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_bill_items_item_id ON zoho_books_bill_items(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_bill_items_sku ON zoho_books_bill_items(sku) WHERE sku IS NOT NULL;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_zoho_books_invoice_items_updated_at
  BEFORE UPDATE ON zoho_books_invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_salesorder_items_updated_at
  BEFORE UPDATE ON zoho_books_salesorder_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_purchaseorder_items_updated_at
  BEFORE UPDATE ON zoho_books_purchaseorder_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_bill_items_updated_at
  BEFORE UPDATE ON zoho_books_bill_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE zoho_books_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_salesorder_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_purchaseorder_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_bill_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Authenticated users can read line items
CREATE POLICY "Authenticated users can read invoice items"
  ON zoho_books_invoice_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read salesorder items"
  ON zoho_books_salesorder_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read purchaseorder items"
  ON zoho_books_purchaseorder_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read bill items"
  ON zoho_books_bill_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access to invoice items"
  ON zoho_books_invoice_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to salesorder items"
  ON zoho_books_salesorder_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to purchaseorder items"
  ON zoho_books_purchaseorder_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to bill items"
  ON zoho_books_bill_items
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comments
COMMENT ON TABLE zoho_books_invoice_items IS 'Line items for Zoho Books invoices. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_salesorder_items IS 'Line items for Zoho Books sales orders. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_purchaseorder_items IS 'Line items for Zoho Books purchase orders. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_bill_items IS 'Line items for Zoho Books bills. Synced from Zoho Books API.';
