/**
 * CrmQuoteEntity
 * 
 * Entity definition for Zoho CRM Quotes.
 */

export class CrmQuoteEntity {
  static tableName = 'zoho_crm_quotes';
  static zohoIdField = 'id';
  static apiEndpoint = '/Quotes';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Subject': { dbColumn: 'subject', required: false, transform: (v) => v || null },
    'Quote_Number': { dbColumn: 'quote_number', required: false, transform: (v) => v || null },
    'Valid_Till': { dbColumn: 'valid_till', required: false, transform: (v) => v || null },
    'Billing_Street': { dbColumn: 'billing_street', required: false, transform: (v) => v || null },
    'Billing_City': { dbColumn: 'billing_city', required: false, transform: (v) => v || null },
    'Billing_State': { dbColumn: 'billing_state', required: false, transform: (v) => v || null },
    'Billing_Code': { dbColumn: 'billing_code', required: false, transform: (v) => v || null },
    'Billing_Country': { dbColumn: 'billing_country', required: false, transform: (v) => v || null },
    'Shipping_Street': { dbColumn: 'shipping_street', required: false, transform: (v) => v || null },
    'Shipping_City': { dbColumn: 'shipping_city', required: false, transform: (v) => v || null },
    'Shipping_State': { dbColumn: 'shipping_state', required: false, transform: (v) => v || null },
    'Shipping_Code': { dbColumn: 'shipping_code', required: false, transform: (v) => v || null },
    'Shipping_Country': { dbColumn: 'shipping_country', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Account_Name': { dbColumn: 'account_id', required: false, transform: (v) => v?.id || null },
    'Contact_Name': { dbColumn: 'contact_id', required: false, transform: (v) => v?.id || null },
    
    // Line items stored as JSONB (CRM line items are custom-defined per module and not used for calculations)
    'Quoted_Items': { dbColumn: 'quoted_items', required: false, transform: (v) => Array.isArray(v) ? JSON.stringify(v) : null },
    'Description': null,
    'Terms_and_Conditions': null,
    'Grand_Total': null,
    'Discount': null,
    'Tax': null,
  };

  static transformToDbRecord(zohoQuote) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoQuote[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    // Handle Quoted_Items as JSONB (already transformed above, but ensure it's valid JSON)
    if (record.quoted_items && typeof record.quoted_items === 'string') {
      try {
        JSON.parse(record.quoted_items); // Validate it's valid JSON
      } catch (e) {
        // If invalid, set to null
        record.quoted_items = null;
      }
    }

    return record;
  }

  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
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
}
