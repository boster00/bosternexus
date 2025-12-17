-- Add sub_total column to transaction tables if missing
-- This migration is idempotent and safe to run multiple times

-- Add sub_total to invoices if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'zoho_books_invoices' 
    AND column_name = 'sub_total'
  ) THEN
    ALTER TABLE zoho_books_invoices 
    ADD COLUMN sub_total NUMERIC(15, 2);
    
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'zoho_books_invoices_valid_sub_total' 
      AND conrelid = 'zoho_books_invoices'::regclass
    ) THEN
      ALTER TABLE zoho_books_invoices 
      ADD CONSTRAINT zoho_books_invoices_valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0);
    END IF;
  END IF;
END $$;

-- Add sub_total to salesorders if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'zoho_books_salesorders' 
    AND column_name = 'sub_total'
  ) THEN
    ALTER TABLE zoho_books_salesorders 
    ADD COLUMN sub_total NUMERIC(15, 2);
    
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'zoho_books_salesorders_valid_sub_total' 
      AND conrelid = 'zoho_books_salesorders'::regclass
    ) THEN
      ALTER TABLE zoho_books_salesorders 
      ADD CONSTRAINT zoho_books_salesorders_valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0);
    END IF;
  END IF;
END $$;

-- Add sub_total to purchaseorders if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'sub_total'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders 
    ADD COLUMN sub_total NUMERIC(15, 2);
    
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'zoho_books_purchaseorders_valid_sub_total' 
      AND conrelid = 'zoho_books_purchaseorders'::regclass
    ) THEN
      ALTER TABLE zoho_books_purchaseorders 
      ADD CONSTRAINT zoho_books_purchaseorders_valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0);
    END IF;
  END IF;
END $$;

-- Add sub_total to bills if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'zoho_books_bills' 
    AND column_name = 'sub_total'
  ) THEN
    ALTER TABLE zoho_books_bills 
    ADD COLUMN sub_total NUMERIC(15, 2);
    
    -- Add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'zoho_books_bills_valid_sub_total' 
      AND conrelid = 'zoho_books_bills'::regclass
    ) THEN
      ALTER TABLE zoho_books_bills 
      ADD CONSTRAINT zoho_books_bills_valid_sub_total CHECK (sub_total IS NULL OR sub_total >= 0);
    END IF;
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN zoho_books_invoices.sub_total IS 'Subtotal amount before taxes and adjustments';
COMMENT ON COLUMN zoho_books_salesorders.sub_total IS 'Subtotal amount before taxes and adjustments';
COMMENT ON COLUMN zoho_books_purchaseorders.sub_total IS 'Subtotal amount before taxes and adjustments';
COMMENT ON COLUMN zoho_books_bills.sub_total IS 'Subtotal amount before taxes and adjustments';
