/**
 * DeskDepartmentEntity
 * 
 * Entity definition for Zoho Desk Departments.
 */

export class DeskDepartmentEntity {
  static tableName = 'zoho_desk_departments';
  static zohoIdField = 'id';
  static apiEndpoint = '/departments';
  static service = 'desk';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'createdTime': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'modifiedTime': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    
    // Ignored fields
    'description': null,
    'isDefault': null,
    'isEnabled': null,
  };

  static transformToDbRecord(zohoDepartment) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoDepartment[zohoField];
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
