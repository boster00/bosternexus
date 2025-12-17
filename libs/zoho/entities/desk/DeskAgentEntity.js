/**
 * DeskAgentEntity
 * 
 * Entity definition for Zoho Desk Agents.
 */

export class DeskAgentEntity {
  static tableName = 'zoho_desk_agents';
  static zohoIdField = 'id';
  static apiEndpoint = '/agents';
  static service = 'desk';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'firstName': { dbColumn: 'first_name', required: false, transform: (v) => v || null },
    'lastName': { dbColumn: 'last_name', required: false, transform: (v) => v || null },
    'emailId': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'roleId': { dbColumn: 'role_id', required: false, transform: (v) => v || null },
    'profileId': { dbColumn: 'profile_id', required: false, transform: (v) => v || null },
    'status': { dbColumn: 'status', required: false, transform: (v) => v || null },
    'createdTime': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'modifiedTime': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    
    // Ignored fields (can store as JSONB if needed)
    'associatedDepartmentIds': null, // Array of department IDs
    'phone': null,
    'mobile': null,
    'photoURL': null,
  };

  static transformToDbRecord(zohoAgent) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoAgent[zohoField];
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
