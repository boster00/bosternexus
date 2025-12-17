-- Add reference_number column to all transaction tables
-- This field is commonly used in Zoho Books for external reference numbers (e.g., PO numbers, order numbers)

-- Add reference_number to invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE zoho_books_invoices ADD COLUMN reference_number TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_invoices_reference_number 
      ON zoho_books_invoices(reference_number) WHERE reference_number IS NOT NULL;
  END IF;
END $$;

-- Add reference_number to salesorders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE zoho_books_salesorders ADD COLUMN reference_number TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_salesorders_reference_number 
      ON zoho_books_salesorders(reference_number) WHERE reference_number IS NOT NULL;
  END IF;
END $$;

-- Add reference_number to purchaseorders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ADD COLUMN reference_number TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_purchaseorders_reference_number 
      ON zoho_books_purchaseorders(reference_number) WHERE reference_number IS NOT NULL;
  END IF;
END $$;

-- Add reference_number to bills
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE zoho_books_bills ADD COLUMN reference_number TEXT;
    CREATE INDEX IF NOT EXISTS idx_zoho_books_bills_reference_number 
      ON zoho_books_bills(reference_number) WHERE reference_number IS NOT NULL;
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN zoho_books_invoices.reference_number IS 'External reference number from Zoho Books (e.g., customer PO number)';
COMMENT ON COLUMN zoho_books_salesorders.reference_number IS 'External reference number from Zoho Books (e.g., customer PO number)';
COMMENT ON COLUMN zoho_books_purchaseorders.reference_number IS 'External reference number from Zoho Books (e.g., vendor reference)';
COMMENT ON COLUMN zoho_books_bills.reference_number IS 'External reference number from Zoho Books (e.g., vendor reference)';
