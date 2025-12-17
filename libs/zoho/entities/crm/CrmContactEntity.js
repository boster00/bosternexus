/**
 * CrmContactEntity
 * 
 * Entity definition for Zoho CRM Contacts.
 * Defines field mappings, transformations, and table structure.
 */

export class CrmContactEntity {
  static tableName = 'zoho_crm_contacts';
  static zohoIdField = 'id';
  static apiEndpoint = '/Contacts';
  static service = 'crm';

  /**
   * Field mappings from Zoho API to database columns
   * CRM uses dynamic fields, but we'll map common standard fields
   */
  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'First_Name': { dbColumn: 'first_name', required: false, transform: (v) => v || null },
    'Last_Name': { dbColumn: 'last_name', required: false, transform: (v) => v || null },
    'Full_Name': { dbColumn: 'full_name', required: false, transform: (v) => v || null },
    'Email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'Phone': { dbColumn: 'phone', required: false, transform: (v) => v || null },
    'Mobile': { dbColumn: 'mobile', required: false, transform: (v) => v || null },
    'Department': { dbColumn: 'department', required: false, transform: (v) => v || null },
    'Title': { dbColumn: 'title', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    
    // Owner is an object, we'll extract the ID
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed later)
    'Mailing_Street': null,
    'Mailing_City': null,
    'Mailing_State': null,
    'Mailing_Code': null,
    'Mailing_Country': null,
    'Other_Street': null,
    'Other_City': null,
    'Other_State': null,
    'Other_Code': null,
    'Other_Country': null,
    'Description': null,
    'Account_Name': null, // This is a lookup, store as JSONB if needed
    'Lead_Source': null,
    'Secondary_Email': null,
    'Home_Phone': null,
    'Fax': null,
    'Skype_ID': null,
    'Twitter': null,
    'LinkedIn': null,
  };

  /**
   * Transform Zoho payload to database record
   * @param {object} zohoContact - Raw contact from Zoho API
   * @returns {object} Database-ready record
   */
  static transformToDbRecord(zohoContact) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

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

  /**
   * Extract contact data from Zoho API response
   * CRM API returns: { data: [...], info: {...} }
   * @param {object} response - Raw Zoho API response
   * @returns {Array} Array of contact objects
   */
  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    // CRM API returns data in 'data' array
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
