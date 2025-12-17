/**
 * BooksLineItemEntity
 * 
 * Unified entity definition for Zoho Books Line Items.
 * Handles line items for all transaction types: invoices, salesorders, purchaseorders, bills.
 * Uses parent_id and parent_type to reference parent transactions.
 */

export class BooksLineItemEntity {
  static tableName = 'zoho_books_line_items';
  static zohoIdField = 'line_item_id';
  static service = 'books';

  /**
   * Field mappings from Zoho API to database columns
   * These fields are consistent across all transaction types (invoices, salesorders, purchaseorders, bills)
   */
  static fieldMappings = {
    'line_item_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'item_id': { dbColumn: 'item_id', required: false, transform: (v) => v || null },
    'sku': { dbColumn: 'sku', required: false, transform: (v) => v || null },
    'name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'description': { dbColumn: 'description', required: false, transform: (v) => v || null },
    'quantity': { dbColumn: 'quantity', required: false, transform: (v) => v != null ? Number(v) : null },
    'rate': { dbColumn: 'rate', required: false, transform: (v) => v != null ? Number(v) : null },
    // Zoho Books API returns 'item_total', not 'total'
    'item_total': { dbColumn: 'total', required: false, transform: (v) => v != null ? Number(v) : null },
    // Also check for 'total' as fallback (some APIs might use it)
    'total': { dbColumn: 'total', required: false, transform: (v) => v != null ? Number(v) : null },
    
    // Ignored fields (common across all transaction types)
    'item_custom_fields': null,
    'product_type': null,
    'tax_id': null,
    'tax_name': null,
    'tax_type': null,
    'tax_percentage': null,
    'item_tax': null,
    'item_tax_id': null,
    'discount': null,
    'discount_amount': null,
    'unit': null,
    'bcy_rate': null,
    'bcy_total': null,
    'bcy_tax': null,
    'purchase_rate': null,
    'purchase_description': null,
    'account_id': null,
    'account_name': null,
    'project_id': null,
    'project_name': null,
    'expense_id': null,
    'expense_name': null,
    'time_entry_ids': null,
    'tags': null,
    'line_item_index': null,
  };

  /**
   * Transform Zoho line item payload to database record
   * @param {object} zohoLineItem - Raw line item from Zoho API
   * @param {string} parentId - UUID of parent transaction in database
   * @param {string} parentType - Type of parent transaction: 'invoice', 'salesorder', 'purchaseorder', or 'bill'
   * @returns {object} Database-ready record
   */
  static transformToDbRecord(zohoLineItem, parentId, parentType) {
    if (!parentId || !parentType) {
      throw new Error('parentId and parentType are required for line items');
    }

    const validParentTypes = ['invoice', 'salesorder', 'purchaseorder', 'bill'];
    if (!validParentTypes.includes(parentType)) {
      throw new Error(`Invalid parentType: ${parentType}. Must be one of: ${validParentTypes.join(', ')}`);
    }

    const record = {
      parent_id: parentId,
      parent_type: parentType,
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoLineItem[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        // Handle special case: if both 'item_total' and 'total' map to 'total', prefer 'item_total'
        if (mapping.dbColumn === 'total' && record.total !== undefined && zohoField === 'total') {
          // 'item_total' was already set, skip 'total' (prefer item_total)
          continue;
        }
        record[mapping.dbColumn] = transformedValue;
      }
    }

    // Calculate total if not provided by Zoho (fallback: quantity * rate)
    if (record.total === null || record.total === undefined) {
      if (record.quantity != null && record.rate != null) {
        record.total = Number((record.quantity * record.rate).toFixed(2));
      }
    }

    return record;
  }

  /**
   * Get list of required fields
   * @returns {Array<string>} Array of required field names
   */
  static getRequiredFields() {
    return Object.entries(this.fieldMappings)
      .filter(([_, mapping]) => mapping !== null && mapping.required)
      .map(([zohoField, mapping]) => mapping.dbColumn);
  }

  /**
   * Validate that a record has all required fields
   * @param {object} record - Database record
   * @returns {object} { valid: boolean, missing: Array<string> }
   */
  static validateRecord(record) {
    const required = this.getRequiredFields();
    const missing = required.filter(field => record[field] === null || record[field] === undefined);

    // Also check that parent_id and parent_type are present
    if (!record.parent_id) {
      missing.push('parent_id');
    }
    if (!record.parent_type) {
      missing.push('parent_type');
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}
