/**
 * CrmEmailSequenceEntity
 * 
 * Entity definition for Zoho CRM Email Sequences (custom module).
 */

export class CrmEmailSequenceEntity {
  static tableName = 'zoho_crm_email_sequences';
  static zohoIdField = 'id';
  static apiEndpoint = '/Email_Sequences';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'Unique_Name': { dbColumn: 'unique_name', required: false, transform: (v) => v || null },
    'Type': { dbColumn: 'type', required: false, transform: (v) => v || null },
    'Email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'Email_Opt_Out': { dbColumn: 'email_opt_out', required: false, transform: (v) => v || null },
    'Record_Status__s': { dbColumn: 'record_status', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Last_Activity_Time': { dbColumn: 'last_activity_time', required: false, transform: (v) => v || null },
    'Unsubscribed_Time': { dbColumn: 'unsubscribed_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Contact': { dbColumn: 'contact_id', required: false, transform: (v) => v?.id || null },
    'Related_Quote': { dbColumn: 'related_quote_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed later)
    'Tag': null,
    'Description': null,
  };

  static transformToDbRecord(zohoEmailSequence) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoEmailSequence[zohoField];
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
