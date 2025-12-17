# Field Comparison: Entity Definitions vs Database Tables

## Transaction Tables

### Invoices (`zoho_books_invoices`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- zoho_id (TEXT, UNIQUE, NOT NULL)
- invoice_number (TEXT)
- date (DATE)
- status (TEXT)
- customer_id (TEXT)
- customer_name (TEXT)
- total (NUMERIC(15, 2))
- sub_total (NUMERIC(15, 2))
- tax_total (NUMERIC(15, 2))
- last_modified_time (TIMESTAMPTZ)
- synced_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- invoice_number ✅
- date ✅
- status ✅
- customer_id ✅
- customer_name ✅
- total ✅
- sub_total ✅
- tax_total ✅
- last_modified_time ✅
- synced_at ✅ (added in transformToDbRecord)

**Status:** ✅ MATCH - All entity fields exist in database

---

### Sales Orders (`zoho_books_salesorders`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- zoho_id (TEXT, UNIQUE, NOT NULL)
- salesorder_number (TEXT)
- date (DATE)
- status (TEXT)
- customer_id (TEXT)
- customer_name (TEXT)
- total (NUMERIC(15, 2))
- sub_total (NUMERIC(15, 2))
- tax_total (NUMERIC(15, 2))
- last_modified_time (TIMESTAMPTZ)
- synced_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- salesorder_number ✅
- date ✅
- status ✅
- customer_id ✅
- customer_name ✅
- total ✅
- sub_total ✅
- tax_total ✅
- last_modified_time ✅
- synced_at ✅ (added in transformToDbRecord)

**Status:** ✅ MATCH - All entity fields exist in database

---

### Purchase Orders (`zoho_books_purchaseorders`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- zoho_id (TEXT, UNIQUE, NOT NULL)
- purchaseorder_number (TEXT)
- date (DATE)
- status (TEXT)
- vendor_id (TEXT)
- vendor_name (TEXT)
- total (NUMERIC(15, 2))
- sub_total (NUMERIC(15, 2))
- tax_total (NUMERIC(15, 2))
- last_modified_time (TIMESTAMPTZ)
- synced_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- purchaseorder_number ✅
- date ✅
- status ✅
- vendor_id ✅
- vendor_name ✅
- total ✅
- sub_total ✅
- tax_total ✅
- last_modified_time ✅
- synced_at ✅ (added in transformToDbRecord)

**Status:** ✅ MATCH - All entity fields exist in database

**Note:** Entity has duplicate entries for `vendor_id` and `vendor_name` in ignored fields (lines 50-51), but this doesn't affect functionality.

---

### Bills (`zoho_books_bills`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- zoho_id (TEXT, UNIQUE, NOT NULL)
- bill_number (TEXT)
- date (DATE)
- status (TEXT)
- vendor_id (TEXT)
- vendor_name (TEXT)
- total (NUMERIC(15, 2))
- sub_total (NUMERIC(15, 2))
- tax_total (NUMERIC(15, 2))
- last_modified_time (TIMESTAMPTZ)
- synced_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- bill_number ✅
- date ✅
- status ✅
- vendor_id ✅
- vendor_name ✅
- total ✅
- sub_total ✅
- tax_total ✅
- last_modified_time ✅
- synced_at ✅ (added in transformToDbRecord)

**Status:** ✅ MATCH - All entity fields exist in database

---

## Line Item Tables

### Invoice Items (`zoho_books_invoice_items`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- related_invoice_id (UUID, NOT NULL, FOREIGN KEY)
- zoho_id (TEXT, NOT NULL)
- item_id (TEXT)
- sku (TEXT)
- name (TEXT)
- description (TEXT)
- quantity (NUMERIC(15, 4))
- rate (NUMERIC(15, 2))
- total (NUMERIC(15, 2))
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- item_id ✅
- sku ✅
- name ✅
- description ✅
- quantity ✅
- rate ✅
- total ✅
- related_invoice_id ✅ (added in transformToDbRecord as parameter)

**Status:** ✅ MATCH - All entity fields exist in database

---

### Sales Order Items (`zoho_books_salesorder_items`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- related_salesorder_id (UUID, NOT NULL, FOREIGN KEY)
- zoho_id (TEXT, NOT NULL)
- item_id (TEXT)
- sku (TEXT)
- name (TEXT)
- description (TEXT)
- quantity (NUMERIC(15, 4))
- rate (NUMERIC(15, 2))
- total (NUMERIC(15, 2))
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- item_id ✅
- sku ✅
- name ✅
- description ✅
- quantity ✅
- rate ✅
- total ✅
- related_salesorder_id ✅ (added in transformToDbRecord as parameter)

**Status:** ✅ MATCH - All entity fields exist in database

---

### Purchase Order Items (`zoho_books_purchaseorder_items`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- related_purchaseorder_id (UUID, NOT NULL, FOREIGN KEY)
- zoho_id (TEXT, NOT NULL)
- item_id (TEXT)
- sku (TEXT)
- name (TEXT)
- description (TEXT)
- quantity (NUMERIC(15, 4))
- rate (NUMERIC(15, 2))
- total (NUMERIC(15, 2))
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- item_id ✅
- sku ✅
- name ✅
- description ✅
- quantity ✅
- rate ✅
- total ✅
- related_purchaseorder_id ✅ (added in transformToDbRecord as parameter)

**Status:** ✅ MATCH - All entity fields exist in database

---

### Bill Items (`zoho_books_bill_items`)

**Database Columns:**
- id (UUID, PRIMARY KEY)
- related_bill_id (UUID, NOT NULL, FOREIGN KEY)
- zoho_id (TEXT, NOT NULL)
- item_id (TEXT)
- sku (TEXT)
- name (TEXT)
- description (TEXT)
- quantity (NUMERIC(15, 4))
- rate (NUMERIC(15, 2))
- total (NUMERIC(15, 2))
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT NOW())

**Entity Mappings (dbColumn values):**
- zoho_id ✅
- item_id ✅
- sku ✅
- name ✅
- description ✅
- quantity ✅
- rate ✅
- total ✅
- related_bill_id ✅ (added in transformToDbRecord as parameter)

**Status:** ✅ MATCH - All entity fields exist in database

---

## Summary

✅ **All entity field mappings match database table columns**

### Notes:
1. **Auto-managed fields:** `id`, `created_at`, `updated_at` are managed by the database (DEFAULT/NOW() or triggers)
2. **Runtime fields:** `synced_at` is added in `transformToDbRecord()` method, not in fieldMappings
3. **Foreign keys:** Line item `related_*_id` fields are passed as parameters to `transformToDbRecord()`, not from Zoho API
4. **Duplicate entries:** `BooksPurchaseOrderEntity` has duplicate `vendor_id` and `vendor_name` in ignored fields (lines 50-51), but this doesn't affect functionality

### Potential Issues:
- None found - all mappings are correct ✅
