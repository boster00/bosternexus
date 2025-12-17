/**
 * BooksContactEntity
 * 
 * Entity definition for Zoho Books Contacts (Customers and Vendors).
 * Defines field mappings, transformations, and table structure.
 */

export class BooksContactEntity {
  static tableName = 'zoho_books_contacts';
  static zohoIdField = 'contact_id';
  static apiEndpoint = '/contacts';
  static service = 'books';

  /**
   * Field mappings from Zoho API to database columns
   */
  static fieldMappings = {
    'contact_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'contact_name': { dbColumn: 'contact_name', required: false, transform: (v) => v || null },
    'company_name': { dbColumn: 'company_name', required: false, transform: (v) => v || null },
    'contact_type': { dbColumn: 'contact_type', required: false, transform: (v) => v || null }, // 'customer' or 'vendor'
    'customer_sub_type': { dbColumn: 'customer_sub_type', required: false, transform: (v) => v || null },
    'credit_limit': { dbColumn: 'credit_limit', required: false, transform: (v) => v != null ? Number(v) : null },
    'is_portal_enabled': { dbColumn: 'is_portal_enabled', required: false, transform: (v) => v === true },
    'language_code': { dbColumn: 'language_code', required: false, transform: (v) => v || null },
    'is_taxable': { dbColumn: 'is_taxable', required: false, transform: (v) => v === true },
    'tax_id': { dbColumn: 'tax_id', required: false, transform: (v) => v || null },
    'tax_name': { dbColumn: 'tax_name', required: false, transform: (v) => v || null },
    'tax_percentage': { dbColumn: 'tax_percentage', required: false, transform: (v) => v != null ? Number(v) : null },
    'tax_authority_id': { dbColumn: 'tax_authority_id', required: false, transform: (v) => v || null },
    'tax_exemption_id': { dbColumn: 'tax_exemption_id', required: false, transform: (v) => v || null },
    'place_of_contact': { dbColumn: 'place_of_contact', required: false, transform: (v) => v || null },
    'gst_no': { dbColumn: 'gst_no', required: false, transform: (v) => v || null },
    'gst_treatment': { dbColumn: 'gst_treatment', required: false, transform: (v) => v || null },
    'vat_treatment': { dbColumn: 'vat_treatment', required: false, transform: (v) => v || null },
    'created_time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'last_modified_time': { dbColumn: 'last_modified_time', required: false, transform: (v) => v || null },
    
    // Ignored fields
    'billing_address': null,
    'shipping_address': null,
    'contact_persons': null,
    'default_templates': null,
    'payment_terms': null,
    'payment_terms_label': null,
    'currency_id': null,
    'currency_code': null,
    'currency_symbol': null,
    'opening_balance_amount': null,
    'exchange_rate': null,
    'outstanding_receivable_amount': null,
    'outstanding_payable_amount': null,
    'unused_credits_receivable_amount': null,
    'unused_credits_payable_amount': null,
    'status': null,
    'payment_reminder_enabled': null,
    'custom_fields': null,
    'custom_field_hash': null,
    'ach_supported': null,
    'has_attachment': null,
    'is_linked_with_zohocrm': null,
    'zcrm_contact_id': null,
    'zcrm_contact_name': null,
  };

  static transformToDbRecord(zohoContact) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoContact[zohoField];
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
   * Extract contact data from Zoho API response
   * Handles both list responses (plural key) and single record responses (singular key)
   * @param {object} response - Raw Zoho API response
   * @returns {Array} Array of contact objects (always returns array, even for single records)
   */
  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    // Derive module names from apiEndpoint
    // /contacts -> plural: 'contacts', singular: 'contact'
    const pluralName = this.apiEndpoint.replace('/', ''); // 'contacts'
    const singularName = pluralName.slice(0, -1); // 'contact' (remove 's')

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
