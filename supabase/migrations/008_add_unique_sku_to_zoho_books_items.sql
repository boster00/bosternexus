-- Add UNIQUE constraint on SKU for zoho_books_items table
-- This allows SKU to be used as the primary key for upsert operations
-- Note: PostgreSQL allows multiple NULL values in a UNIQUE constraint,
-- so items without SKU can still be inserted (they'll use zoho_id for uniqueness)

-- First, check if there are any duplicate non-null SKUs
-- If there are duplicates, we need to handle them before adding the constraint
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Count duplicate SKUs (excluding NULLs)
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT sku, COUNT(*) as cnt
    FROM zoho_books_items
    WHERE sku IS NOT NULL
    GROUP BY sku
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE WARNING 'Found % duplicate SKU values. Please resolve duplicates before adding UNIQUE constraint.', duplicate_count;
    RAISE EXCEPTION 'Cannot add UNIQUE constraint: duplicate SKUs exist. Please resolve duplicates first.';
  END IF;
END $$;

-- Add UNIQUE constraint on SKU
-- PostgreSQL UNIQUE constraints allow multiple NULL values by default
-- This constraint will enforce uniqueness for non-null SKUs
ALTER TABLE zoho_books_items 
  ADD CONSTRAINT unique_zoho_books_items_sku UNIQUE (sku);

-- Add comment
COMMENT ON CONSTRAINT unique_zoho_books_items_sku ON zoho_books_items IS 'Unique constraint on SKU for zoho_books_items. Allows multiple NULL values but enforces uniqueness for non-null SKUs.';
