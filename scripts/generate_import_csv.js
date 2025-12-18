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
  if (!amountStr || amountStr.trim() === '') return '';
  const match = amountStr.match(/USD\s*([\d,]+\.?\d*)/);
  if (match) {
    return match[1].replace(/,/g, '');
  }
  return '';
}

// Helper function to parse integer
function parseIntSafe(value) {
  if (!value || value.trim() === '') return '';
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? '' : parsed.toString();
}

// Helper function to parse boolean
function parseBoolean(value) {
  if (!value) return 'false';
  return value.toLowerCase() === 'true' ? 'true' : 'false';
}

// CSV column headers matching database schema
const csvHeaders = [
  'zoho_id',
  'name',
  'sku',
  'description',
  'rate',
  'purchase_rate',
  'purchase_description',
  'status',
  'stock_on_hand',
  'item_type',
  'product_type',
  'reorder_level',
  'can_be_sold',
  'can_be_purchased',
  'track_inventory'
];

// Generate CSV rows
const csvRows = [];

rowsToProcess.forEach((row) => {
  const zohoId = row['Item ID'] || '';
  const name = row['Item Name'] || 'Unknown Item';
  const sku = row['SKU'] || '';
  const description = row['Description'] || '';
  const rate = parseAmount(row['Rate']);
  const purchaseRate = parseAmount(row['Purchase Rate']);
  const purchaseDescription = row['Purchase Description'] || '';
  const status = row['Status'] || 'Active';
  let stockOnHand = parseIntSafe(row['Stock On Hand']);
  // Handle negative stock values - set to empty (will be NULL in DB)
  if (stockOnHand && parseInt(stockOnHand) < 0) {
    stockOnHand = '';
  }
  const itemType = row['Item Type'] || 'Inventory';
  const productType = row['Product Type'] || 'goods';
  let reorderPoint = parseIntSafe(row['Reorder Point']);
  // Handle negative reorder points - set to empty
  if (reorderPoint && parseInt(reorderPoint) < 0) {
    reorderPoint = '';
  }
  const sellable = parseBoolean(row['Sellable']);
  const purchasable = parseBoolean(row['Purchasable']);
  const trackInventory = parseBoolean(row['Track Inventory']);
  
  // Map item_type: "Inventory" -> "inventory"
  let itemTypeValue = 'inventory';
  if (itemType && itemType.toLowerCase() === 'inventory') {
    itemTypeValue = 'inventory';
  }
  
  // Map status: "Active" -> "active"
  const statusValue = status.toLowerCase() === 'active' ? 'active' : 'inactive';
  
  // Map product_type: "goods" -> "goods"
  const productTypeValue = productType.toLowerCase() === 'goods' ? 'goods' : 'goods';
  
  // Skip if no SKU
  if (!sku || sku.trim() === '') {
    return;
  }
  
  // Escape CSV values (handle quotes and commas)
  function escapeCsvValue(value) {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const str = String(value);
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }
  
  const csvRow = [
    escapeCsvValue(zohoId),
    escapeCsvValue(name),
    escapeCsvValue(sku),
    escapeCsvValue(description),
    escapeCsvValue(rate),
    escapeCsvValue(purchaseRate),
    escapeCsvValue(purchaseDescription),
    escapeCsvValue(statusValue),
    escapeCsvValue(stockOnHand),
    escapeCsvValue(itemTypeValue),
    escapeCsvValue(productTypeValue),
    escapeCsvValue(reorderPoint),
    escapeCsvValue(sellable),
    escapeCsvValue(purchasable),
    escapeCsvValue(trackInventory)
  ];
  
  csvRows.push(csvRow);
});

// Generate CSV content
let csvContent = csvHeaders.join(',') + '\n';
csvRows.forEach(row => {
  csvContent += row.join(',') + '\n';
});

// Write to file
const outputPath = path.join(csvDir, 'items_combined.csv');
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log(`CSV file created: ${outputPath}`);
console.log(`Processed ${csvRows.length} rows`);
console.log(`Headers: ${csvHeaders.join(', ')}`);
