const fs = require('fs');
const path = require('path');

// Read and parse CSV files
const csvFiles = ['Item00.csv', 'Item01.csv', 'Item02.csv'];
const csvDir = path.join(__dirname, '../supabase/external_csvs');
const allRows = [];

csvFiles.forEach(file => {
  const filePath = path.join(csvDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  // Parse all rows (skip header)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Simple CSV parsing (handles quoted fields)
    const row = {};
    let currentField = '';
    let inQuotes = false;
    let fieldIndex = 0;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row[headers[fieldIndex]] = currentField.trim();
        currentField = '';
        fieldIndex++;
      } else {
        currentField += char;
      }
    }
    // Add last field
    if (fieldIndex < headers.length) {
      row[headers[fieldIndex]] = currentField.trim();
    }
    
    allRows.push(row);
  }
});

// Process all rows
const rowsToProcess = allRows;

// Helper function to parse USD amount
function parseAmount(amountStr) {
  if (!amountStr || amountStr.trim() === '') return null;
  const match = amountStr.match(/USD\s*([\d,]+\.?\d*)/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  return null;
}

// Helper function to parse integer
function parseIntSafe(value) {
  if (!value || value.trim() === '') return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Helper function to parse boolean
function parseBoolean(value) {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

// Helper function to escape SQL strings
function escapeSql(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

// Generate SQL
let sql = `-- CSV Migration: Import items from external CSV files
-- This migration upserts items into zoho_books_items table using SKU as the conflict key
-- All rows from Item00.csv, Item01.csv, and Item02.csv

BEGIN;

`;

rowsToProcess.forEach((row, index) => {
  const zohoId = row['Item ID'] || null;
  const name = row['Item Name'] || 'Unknown Item';
  const sku = row['SKU'] || null;
  const description = row['Description'] || null;
  const rate = parseAmount(row['Rate']);
  const purchaseRate = parseAmount(row['Purchase Rate']);
  const purchaseDescription = row['Purchase Description'] || null;
  const status = row['Status'] || 'Active';
  let stockOnHand = parseIntSafe(row['Stock On Hand']);
  // Handle negative stock values - set to NULL (database constraint requires >= 0)
  if (stockOnHand !== null && stockOnHand < 0) {
    stockOnHand = null;
  }
  const itemType = row['Item Type'] || 'Inventory';
  const productType = row['Product Type'] || 'goods';
  let reorderPoint = parseIntSafe(row['Reorder Point']);
  // Handle negative reorder points - set to NULL (database constraint requires >= 0)
  if (reorderPoint !== null && reorderPoint < 0) {
    reorderPoint = null;
  }
  const sellable = parseBoolean(row['Sellable']);
  const purchasable = parseBoolean(row['Purchasable']);
  const trackInventory = parseBoolean(row['Track Inventory']);
  
  // Map item_type: "Inventory" -> "inventory", numeric values -> "inventory" (default)
  let itemTypeValue = 'inventory';
  if (itemType && itemType.toLowerCase() === 'inventory') {
    itemTypeValue = 'inventory';
  }
  
  // Map status: "Active" -> "active"
  const statusValue = status.toLowerCase() === 'active' ? 'active' : 'inactive';
  
  // Map product_type: "goods" -> "goods"
  const productTypeValue = productType.toLowerCase() === 'goods' ? 'goods' : 'goods';
  
  // Skip if no SKU (can't upsert without SKU)
  if (!sku || sku.trim() === '') {
    sql += `-- Skipping row ${index + 1}: No SKU\n`;
    return;
  }
  
  sql += `-- Row ${index + 1}: ${name} (SKU: ${sku})\n`;
  sql += `INSERT INTO zoho_books_items (
    zoho_id,
    name,
    sku,
    description,
    rate,
    purchase_rate,
    purchase_description,
    status,
    stock_on_hand,
    item_type,
    product_type,
    reorder_level,
    can_be_sold,
    can_be_purchased,
    track_inventory,
    synced_at
  ) VALUES (
    ${zohoId ? escapeSql(zohoId) : 'NULL'},
    ${escapeSql(name)},
    ${escapeSql(sku)},
    ${description ? escapeSql(description) : 'NULL'},
    ${rate !== null ? rate : 'NULL'},
    ${purchaseRate !== null ? purchaseRate : 'NULL'},
    ${purchaseDescription ? escapeSql(purchaseDescription) : 'NULL'},
    ${escapeSql(statusValue)},
    ${stockOnHand !== null ? stockOnHand : 'NULL'},
    ${escapeSql(itemTypeValue)},
    ${escapeSql(productTypeValue)},
    ${reorderPoint !== null ? reorderPoint : 'NULL'},
    ${sellable},
    ${purchasable},
    ${trackInventory},
    NOW()
  )
  ON CONFLICT (sku) DO UPDATE SET
    zoho_id = COALESCE(EXCLUDED.zoho_id, zoho_books_items.zoho_id),
    name = COALESCE(EXCLUDED.name, zoho_books_items.name),
    description = COALESCE(EXCLUDED.description, zoho_books_items.description),
    rate = COALESCE(EXCLUDED.rate, zoho_books_items.rate),
    purchase_rate = COALESCE(EXCLUDED.purchase_rate, zoho_books_items.purchase_rate),
    purchase_description = COALESCE(EXCLUDED.purchase_description, zoho_books_items.purchase_description),
    status = COALESCE(EXCLUDED.status, zoho_books_items.status),
    stock_on_hand = COALESCE(EXCLUDED.stock_on_hand, zoho_books_items.stock_on_hand),
    item_type = COALESCE(EXCLUDED.item_type, zoho_books_items.item_type),
    product_type = COALESCE(EXCLUDED.product_type, zoho_books_items.product_type),
    reorder_level = COALESCE(EXCLUDED.reorder_level, zoho_books_items.reorder_level),
    can_be_sold = COALESCE(EXCLUDED.can_be_sold, zoho_books_items.can_be_sold),
    can_be_purchased = COALESCE(EXCLUDED.can_be_purchased, zoho_books_items.can_be_purchased),
    track_inventory = COALESCE(EXCLUDED.track_inventory, zoho_books_items.track_inventory),
    synced_at = NOW(),
    updated_at = NOW();

`;
});

sql += `COMMIT;

-- Summary: ${rowsToProcess.length} rows processed
`;

// Write to migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/013_csv_migration.sql');
fs.writeFileSync(migrationPath, sql, 'utf-8');

console.log(`Migration file created: ${migrationPath}`);
console.log(`Processed ${rowsToProcess.length} rows`);
