/**
 * CrmDealEntity
 * 
 * Entity definition for Zoho CRM Deals.
 */

export class CrmDealEntity {
  static tableName = 'zoho_crm_deals';
  static zohoIdField = 'id';
  static apiEndpoint = '/Deals';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Deal_Name': { dbColumn: 'deal_name', required: false, transform: (v) => v || null },
    'Amount': { dbColumn: 'amount', required: false, transform: (v) => v != null ? Number(v) : null },
    'Stage': { dbColumn: 'stage', required: false, transform: (v) => v || null },
    'Closing_Date': { dbColumn: 'closing_date', required: false, transform: (v) => v || null },
    'Pipeline': { dbColumn: 'pipeline', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Account_Name': { dbColumn: 'account_id', required: false, transform: (v) => v?.id || null },
    'Contact_Name': { dbColumn: 'contact_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields
    'Probability': null,
    'Expected_Revenue': null,
    'Type': null,
    'Next_Step': null,
    'Lead_Source': null,
    'Description': null,
  };

  static transformToDbRecord(zohoDeal) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoDeal[zohoField];
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
