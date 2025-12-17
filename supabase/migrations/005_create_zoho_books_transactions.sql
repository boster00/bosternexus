-- Create zoho_books_transactions tables
-- These tables cache Zoho Books transaction data (invoices, salesorders, purchaseorders, bills)

-- Invoices table
CREATE TABLE IF NOT EXISTS zoho_books_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_id TEXT NOT NULL UNIQUE,
  invoice_number TEXT,
  date DATE,
  status TEXT,
  customer_id TEXT,
  customer_name TEXT,
  total NUMERIC(15, 2),
  sub_total NUMERIC(15, 2),
  tax_total NUMERIC(15, 2),
  last_modified_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_total CHECK (total IS NULL OR total >= 0),
  CONSTRAINT valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0),
  CONSTRAINT valid_tax_total CHECK (tax_total IS NULL OR tax_total >= 0)
);

-- Sales Orders table
CREATE TABLE IF NOT EXISTS zoho_books_salesorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_id TEXT NOT NULL UNIQUE,
  salesorder_number TEXT,
  date DATE,
  status TEXT,
  customer_id TEXT,
  customer_name TEXT,
  total NUMERIC(15, 2),
  sub_total NUMERIC(15, 2),
  tax_total NUMERIC(15, 2),
  last_modified_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_total CHECK (total IS NULL OR total >= 0),
  CONSTRAINT valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0),
  CONSTRAINT valid_tax_total CHECK (tax_total IS NULL OR tax_total >= 0)
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS zoho_books_purchaseorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_id TEXT NOT NULL UNIQUE,
  purchaseorder_number TEXT,
  date DATE,
  status TEXT,
  vendor_id TEXT,
  vendor_name TEXT,
  total NUMERIC(15, 2),
  sub_total NUMERIC(15, 2),
  tax_total NUMERIC(15, 2),
  last_modified_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_total CHECK (total IS NULL OR total >= 0),
  CONSTRAINT valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0),
  CONSTRAINT valid_tax_total CHECK (tax_total IS NULL OR tax_total >= 0)
);

-- Bills table
CREATE TABLE IF NOT EXISTS zoho_books_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_id TEXT NOT NULL UNIQUE,
  bill_number TEXT,
  date DATE,
  status TEXT,
  vendor_id TEXT,
  vendor_name TEXT,
  total NUMERIC(15, 2),
  sub_total NUMERIC(15, 2),
  tax_total NUMERIC(15, 2),
  last_modified_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_total CHECK (total IS NULL OR total >= 0),
  CONSTRAINT valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0),
  CONSTRAINT valid_tax_total CHECK (tax_total IS NULL OR tax_total >= 0)
);

-- Create indexes for performance
-- Invoices
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_zoho_id ON zoho_books_invoices(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_date ON zoho_books_invoices(date) WHERE date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_status ON zoho_books_invoices(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_synced_at ON zoho_books_invoices(synced_at);
CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_last_modified_time ON zoho_books_invoices(last_modified_time) WHERE last_modified_time IS NOT NULL;

-- Sales Orders
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_zoho_id ON zoho_books_salesorders(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_date ON zoho_books_salesorders(date) WHERE date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_status ON zoho_books_salesorders(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_synced_at ON zoho_books_salesorders(synced_at);
CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_last_modified_time ON zoho_books_salesorders(last_modified_time) WHERE last_modified_time IS NOT NULL;

-- Purchase Orders
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_zoho_id ON zoho_books_purchaseorders(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_date ON zoho_books_purchaseorders(date) WHERE date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_status ON zoho_books_purchaseorders(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_synced_at ON zoho_books_purchaseorders(synced_at);
CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_last_modified_time ON zoho_books_purchaseorders(last_modified_time) WHERE last_modified_time IS NOT NULL;

-- Bills
CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_zoho_id ON zoho_books_bills(zoho_id);
CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_date ON zoho_books_bills(date) WHERE date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_status ON zoho_books_bills(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_synced_at ON zoho_books_bills(synced_at);
CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_last_modified_time ON zoho_books_bills(last_modified_time) WHERE last_modified_time IS NOT NULL;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_zoho_books_invoices_updated_at
  BEFORE UPDATE ON zoho_books_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_salesorders_updated_at
  BEFORE UPDATE ON zoho_books_salesorders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_purchaseorders_updated_at
  BEFORE UPDATE ON zoho_books_purchaseorders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoho_books_bills_updated_at
  BEFORE UPDATE ON zoho_books_bills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE zoho_books_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_salesorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_purchaseorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_books_bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Authenticated users can read transactions
CREATE POLICY "Authenticated users can read invoices"
  ON zoho_books_invoices
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read salesorders"
  ON zoho_books_salesorders
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read purchaseorders"
  ON zoho_books_purchaseorders
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read bills"
  ON zoho_books_bills
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access to invoices"
  ON zoho_books_invoices
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to salesorders"
  ON zoho_books_salesorders
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to purchaseorders"
  ON zoho_books_purchaseorders
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to bills"
  ON zoho_books_bills
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comments
COMMENT ON TABLE zoho_books_invoices IS 'Cached Zoho Books invoices data. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_salesorders IS 'Cached Zoho Books sales orders data. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_purchaseorders IS 'Cached Zoho Books purchase orders data. Synced from Zoho Books API.';
COMMENT ON TABLE zoho_books_bills IS 'Cached Zoho Books bills data. Synced from Zoho Books API.';
