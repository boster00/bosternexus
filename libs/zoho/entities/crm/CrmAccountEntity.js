/**
 * CrmAccountEntity
 * 
 * Entity definition for Zoho CRM Accounts.
 */

export class CrmAccountEntity {
  static tableName = 'zoho_crm_accounts';
  static zohoIdField = 'id';
  static apiEndpoint = '/Accounts';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Account_Name': { dbColumn: 'account_name', required: false, transform: (v) => v || null },
    'Account_Number': { dbColumn: 'account_number', required: false, transform: (v) => v || null },
    'Website': { dbColumn: 'website', required: false, transform: (v) => v || null },
    'Phone': { dbColumn: 'phone', required: false, transform: (v) => v || null },
    'Industry': { dbColumn: 'industry', required: false, transform: (v) => v || null },
    'Account_Type': { dbColumn: 'account_type', required: false, transform: (v) => v || null },
    'Billing_Street': { dbColumn: 'billing_street', required: false, transform: (v) => v || null },
    'Billing_City': { dbColumn: 'billing_city', required: false, transform: (v) => v || null },
    'Billing_State': { dbColumn: 'billing_state', required: false, transform: (v) => v || null },
    'Billing_Code': { dbColumn: 'billing_code', required: false, transform: (v) => v || null },
    'Billing_Country': { dbColumn: 'billing_country', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields
    'Shipping_Street': null,
    'Shipping_City': null,
    'Shipping_State': null,
    'Shipping_Code': null,
    'Shipping_Country': null,
    'Description': null,
    'Annual_Revenue': null,
    'No_of_Employees': null,
  };

  static transformToDbRecord(zohoAccount) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoAccount[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
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
