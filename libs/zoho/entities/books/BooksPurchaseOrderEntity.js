/**
 * BooksPurchaseOrderEntity
 * 
 * Entity definition for Zoho Books Purchase Orders.
 * Defines field mappings, transformations, and table structure.
 */

export class BooksPurchaseOrderEntity {
  static tableName = 'zoho_books_purchaseorders';
  static zohoIdField = 'purchaseorder_id';
  static apiEndpoint = '/purchaseorders';
  static service = 'books';

  /**
   * Field mappings from Zoho API to database columns
   */
  static fieldMappings = {
    'purchaseorder_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'purchaseorder_number': { dbColumn: 'purchaseorder_number', required: false, transform: (v) => v || null },
    'date': { dbColumn: 'date', required: false, transform: (v) => v || null },
    'status': { dbColumn: 'status', required: false, transform: (v) => v || null },
    'vendor_id': { dbColumn: 'vendor_id', required: false, transform: (v) => v || null },
    'vendor_name': { dbColumn: 'vendor_name', required: false, transform: (v) => v || null },
    'total': { dbColumn: 'total', required: false, transform: (v) => v != null ? Number(v) : null },
    'sub_total': { dbColumn: 'sub_total', required: false, transform: (v) => v != null ? Number(v) : null },
    'tax_total': { dbColumn: 'tax_total', required: false, transform: (v) => v != null ? Number(v) : null },
    'last_modified_time': { dbColumn: 'last_modified_time', required: false, transform: (v) => v || null },
    'reference_number': { dbColumn: 'reference_number', required: false, transform: (v) => v || null },
    // Note: 'email' is not in Zoho API response - it's extracted from comments and added during sync
    'email': { dbColumn: 'email', required: false, transform: (v) => v !== undefined ? v : undefined },
    
    // Ignored fields
    'line_items': null,
    'custom_fields': null,
    'shipping_address': null,
    'billing_address': null,
    'payment_options': null,
    'payment_terms': null,
    'currency_code': null,
    'currency_symbol': null,
    'price_precision': null,
    'exchange_rate': null,
    'discount': null,
    'discount_type': null,
    'is_discount_before_tax': null,
    'discount_amount': null,
    'taxes': null,
    'shipping_charge': null,
    'adjustment': null,
    'adjustment_description': null,
    'delivery_method': null,
    'delivery_method_id': null,
    'template_id': null,
    'template_name': null,
    'attachment_name': null,
    'can_send_in_mail': null,
    'attachment_path': null,
    'can_send_attachment': null,
    'pricebook_id': null,
    'pricebook_name': null,
    'custom_field_hash': null,
    'template_type': null,
    'notes': null,
    'terms': null,
    'created_time': null,
    'documents': null,
    'has_attachment': null,
    'purchaseorder_url': null,
    'pdf_template_id': null,
    'pdf_template_name': null,
  };

  static transformToDbRecord(zohoPurchaseOrder) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoPurchaseOrder[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    return record;
  }

  static getRequiredFields() {
    return Object.entries(this.fieldMappings)
      .filter(([_, mapping]) => mapping !== null && mapping.required)
      .map(([zohoField, mapping]) => mapping.dbColumn);
  }

  static validateRecord(record) {
    const required = this.getRequiredFields();
    const missing = required.filter(field => record[field] === null || record[field] === undefined);

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Extract transaction data from Zoho API response
   * Handles both list responses (plural key) and single record responses (singular key)
   * @param {object} response - Raw Zoho API response
   * @returns {Array} Array of transaction objects (always returns array, even for single records)
   */
  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    // Derive module names from apiEndpoint
    // /purchaseorders -> plural: 'purchaseorders', singular: 'purchaseorder'
    const pluralName = this.apiEndpoint.replace('/', ''); // 'purchaseorders'
    const singularName = pluralName.slice(0, -1); // 'purchaseorder' (remove 's')

    // Check 1: Plural key (array) - normal list response
    if (response[pluralName] && Array.isArray(response[pluralName])) {
      return response[pluralName];
    }

    // Check 2: Singular key (object) - single record response, wrap in array
    if (response[singularName] && typeof response[singularName] === 'object' && !Array.isArray(response[singularName])) {
      return [response[singularName]];
    }

    // Check 3: Fallback to normalized data array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // Check 4: Fallback to data as single object (wrap in array)
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }

    // No valid response structure found
    return [];
  }
}
