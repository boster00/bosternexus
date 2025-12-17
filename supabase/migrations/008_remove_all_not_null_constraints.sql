-- Remove all NOT NULL constraints from Zoho Books transaction and line items tables
-- This migration is idempotent and safe to run multiple times
-- Note: PRIMARY KEY columns (id) cannot have NULL, so they are excluded

-- ============================================================================
-- TRANSACTION TABLES
-- ============================================================================

-- zoho_books_invoices
DO $$ 
BEGIN
  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoices ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from invoice_number if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'invoice_number'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoices ALTER COLUMN invoice_number DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from synced_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'synced_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoices ALTER COLUMN synced_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoices ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoices' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoices ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_salesorders
DO $$ 
BEGIN
  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorders ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from salesorder_number if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'salesorder_number'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorders ALTER COLUMN salesorder_number DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from synced_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'synced_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorders ALTER COLUMN synced_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorders ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorders' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorders ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_purchaseorders
DO $$ 
BEGIN
  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from purchaseorder_number if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'purchaseorder_number'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ALTER COLUMN purchaseorder_number DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from synced_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'synced_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ALTER COLUMN synced_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorders' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorders ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_bills
DO $$ 
BEGIN
  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bills ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from bill_number if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'bill_number'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bills ALTER COLUMN bill_number DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from synced_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'synced_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bills ALTER COLUMN synced_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bills ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bills' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bills ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- LINE ITEMS TABLES
-- ============================================================================

-- zoho_books_invoice_items
DO $$ 
BEGIN
  -- Remove NOT NULL from related_invoice_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoice_items' 
    AND column_name = 'related_invoice_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoice_items ALTER COLUMN related_invoice_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoice_items' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoice_items ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoice_items' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoice_items ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_invoice_items' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_invoice_items ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_salesorder_items
DO $$ 
BEGIN
  -- Remove NOT NULL from related_salesorder_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorder_items' 
    AND column_name = 'related_salesorder_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorder_items ALTER COLUMN related_salesorder_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorder_items' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorder_items ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorder_items' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorder_items ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_salesorder_items' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_salesorder_items ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_purchaseorder_items
DO $$ 
BEGIN
  -- Remove NOT NULL from related_purchaseorder_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorder_items' 
    AND column_name = 'related_purchaseorder_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorder_items ALTER COLUMN related_purchaseorder_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorder_items' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorder_items ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorder_items' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorder_items ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_purchaseorder_items' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_purchaseorder_items ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;

-- zoho_books_bill_items
DO $$ 
BEGIN
  -- Remove NOT NULL from related_bill_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bill_items' 
    AND column_name = 'related_bill_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bill_items ALTER COLUMN related_bill_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from zoho_id if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bill_items' 
    AND column_name = 'zoho_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bill_items ALTER COLUMN zoho_id DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from created_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bill_items' 
    AND column_name = 'created_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bill_items ALTER COLUMN created_at DROP NOT NULL;
  END IF;

  -- Remove NOT NULL from updated_at if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'zoho_books_bill_items' 
    AND column_name = 'updated_at'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE zoho_books_bill_items ALTER COLUMN updated_at DROP NOT NULL;
  END IF;
END $$;
