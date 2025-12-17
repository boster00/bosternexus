/**
 * DeskContactEntity
 * 
 * Entity definition for Zoho Desk Contacts.
 */

export class DeskContactEntity {
  static tableName = 'zoho_desk_contacts';
  static zohoIdField = 'id';
  static apiEndpoint = '/contacts';
  static service = 'desk';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'firstName': { dbColumn: 'first_name', required: false, transform: (v) => v || null },
    'lastName': { dbColumn: 'last_name', required: false, transform: (v) => v || null },
    'email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'phone': { dbColumn: 'phone', required: false, transform: (v) => v || null },
    'mobile': { dbColumn: 'mobile', required: false, transform: (v) => v || null },
    'accountId': { dbColumn: 'account_id', required: false, transform: (v) => v || null },
    'photoURL': { dbColumn: 'photo_url', required: false, transform: (v) => v || null },
    'createdTime': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'modifiedTime': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    
    // Ignored fields
    'secondaryEmail': null,
    'twitter': null,
    'facebook': null,
    'description': null,
    'timeZone': null,
    'language': null,
    'account': null, // Object, extract account_id above
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

    // Extract account_id from account object if not already set
    if (!record.account_id && zohoContact.account?.id) {
      record.account_id = zohoContact.account.id;
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
