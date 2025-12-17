/**
 * CrmLeadEntity
 * 
 * Entity definition for Zoho CRM Leads.
 */

export class CrmLeadEntity {
  static tableName = 'zoho_crm_leads';
  static zohoIdField = 'id';
  static apiEndpoint = '/Leads';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'First_Name': { dbColumn: 'first_name', required: false, transform: (v) => v || null },
    'Last_Name': { dbColumn: 'last_name', required: false, transform: (v) => v || null },
    'Full_Name': { dbColumn: 'full_name', required: false, transform: (v) => v || null },
    'Email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'Phone': { dbColumn: 'phone', required: false, transform: (v) => v || null },
    'Mobile': { dbColumn: 'mobile', required: false, transform: (v) => v || null },
    'Company': { dbColumn: 'company', required: false, transform: (v) => v || null },
    'Lead_Status': { dbColumn: 'lead_status', required: false, transform: (v) => v || null },
    'Industry': { dbColumn: 'industry', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields
    'Title': null,
    'Lead_Source': null,
    'Annual_Revenue': null,
    'No_of_Employees': null,
    'Website': null,
    'City': null,
    'State': null,
    'Country': null,
    'Zip_Code': null,
    'Street': null,
    'Description': null,
  };

  static transformToDbRecord(zohoLead) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoLead[zohoField];
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
