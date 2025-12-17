/**
 * BooksInvoiceEntity
 * 
 * Entity definition for Zoho Books Invoices.
 * Defines field mappings, transformations, and table structure.
 */

export class BooksInvoiceEntity {
  static tableName = 'zoho_books_invoices';
  static zohoIdField = 'invoice_id';
  static apiEndpoint = '/invoices';
  static service = 'books';

  /**
   * Field mappings from Zoho API to database columns
   * Format: 'zoho_field': { dbColumn: 'db_column', required: boolean, transform: function|null }
   * Set to null to ignore the field
   */
  static fieldMappings = {
    'invoice_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'invoice_number': { dbColumn: 'invoice_number', required: false, transform: (v) => v || null },
    'date': { dbColumn: 'date', required: false, transform: (v) => v || null },
    'status': { dbColumn: 'status', required: false, transform: (v) => v || null },
    'customer_id': { dbColumn: 'customer_id', required: false, transform: (v) => v || null },
    'customer_name': { dbColumn: 'customer_name', required: false, transform: (v) => v || null },
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
    'payment_terms_label': null,
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
    'estimate_id': null,
    'salesperson_id': null,
    'salesperson_name': null,
    'shipping_charge_tax_id': null,
    'shipping_charge_tax_name': null,
    'shipping_charge_tax_percentage': null,
    'shipping_charge_tax_type': null,
    'template_id': null,
    'template_name': null,
    'attachment_name': null,
    'can_send_in_mail': null,
    'salesperson_email': null,
    'attachment_path': null,
    'can_send_attachment': null,
    'allow_partial_payments': null,
    'pricebook_id': null,
    'pricebook_name': null,
    'payment_made': null,
    'credits_applied': null,
    'balance': null,
    'write_off_amount': null,
    'allow_partial_payments': null,
    'payment_reminder_enabled': null,
    'payment_reminder_days': null,
    'custom_field_hash': null,
    'template_type': null,
    'notes': null,
    'terms': null,
    'created_time': null,
    'last_modified_time': null,
    'is_autobill_enabled': null,
    'is_shipping_charge_required': null,
    'is_adjustment_requested': null,
    'is_estimate_created': null,
    'is_advance_invoice': null,
    'advance_invoice_id': null,
    'advance_invoice_number': null,
    'documents': null,
    'has_attachment': null,
    'client_viewed_time': null,
    'is_viewed_by_client': null,
    'invoice_url': null,
    'pdf_template_id': null,
    'pdf_template_name': null,
    'payment_expected_date': null,
    'payment_reminder_id': null,
    'payment_reminder_name': null,
    'payment_reminder_days': null,
    'payment_reminder_enabled': null,
    'is_autobill_enabled': null,
    'is_autobill_enabled_for_this_invoice': null,
    'autobill_enabled_for_this_invoice': null,
    'autobill_enabled': null,
    'autobill_enabled_for_this_invoice': null,
    'autobill_enabled_for_this_invoice': null,
  };

  /**
   * Transform Zoho payload to database record
   * @param {object} zohoInvoice - Raw invoice from Zoho API
   * @returns {object} Database-ready record
   */
  static transformToDbRecord(zohoInvoice) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoInvoice[zohoField];
      
      // Apply transformation if provided
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      // Only set if value is not undefined (allow null)
      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
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
    // /invoices -> plural: 'invoices', singular: 'invoice'
    const pluralName = this.apiEndpoint.replace('/', ''); // 'invoices'
    const singularName = pluralName.slice(0, -1); // 'invoice' (remove 's')

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
