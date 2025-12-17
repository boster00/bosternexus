-- Add email column to all transaction tables
-- This field stores extracted email addresses from transaction comments for CRM cross-referencing

-- Add email to invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE zoho_books_invoices ADD COLUMN email TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_email 
      ON zoho_books_invoices(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Add email to salesorders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE zoho_books_salesorders ADD COLUMN email TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_email 
      ON zoho_books_salesorders(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Add email to purchaseorders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ADD COLUMN email TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_email 
      ON zoho_books_purchaseorders(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Add email to bills
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE zoho_books_bills ADD COLUMN email TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_email 
      ON zoho_books_bills(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN zoho_books_invoices.email IS 'Extracted email addresses from transaction comments (excluding bosterbio.com domain) for CRM cross-referencing';
COMMENT ON COLUMN zoho_books_salesorders.email IS 'Extracted email addresses from transaction comments (excluding bosterbio.com domain) for CRM cross-referencing';
COMMENT ON COLUMN zoho_books_purchaseorders.email IS 'Extracted email addresses from transaction comments (excluding bosterbio.com domain) for CRM cross-referencing';
COMMENT ON COLUMN zoho_books_bills.email IS 'Extracted email addresses from transaction comments (excluding bosterbio.com domain) for CRM cross-referencing';
