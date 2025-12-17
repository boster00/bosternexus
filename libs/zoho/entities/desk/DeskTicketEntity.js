/**
 * DeskTicketEntity
 * 
 * Entity definition for Zoho Desk Tickets.
 */

export class DeskTicketEntity {
  static tableName = 'zoho_desk_tickets';
  static zohoIdField = 'id';
  static apiEndpoint = '/tickets';
  static service = 'desk';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'ticketNumber': { dbColumn: 'ticket_number', required: false, transform: (v) => v || null },
    'subject': { dbColumn: 'subject', required: false, transform: (v) => v || null },
    'status': { dbColumn: 'status', required: false, transform: (v) => v || null },
    'priority': { dbColumn: 'priority', required: false, transform: (v) => v || null },
    'channel': { dbColumn: 'channel', required: false, transform: (v) => v || null },
    'classification': { dbColumn: 'classification', required: false, transform: (v) => v || null },
    'description': { dbColumn: 'description', required: false, transform: (v) => v || null },
    'createdTime': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'modifiedTime': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'dueDate': { dbColumn: 'due_date', required: false, transform: (v) => v || null },
    'departmentId': { dbColumn: 'department_id', required: false, transform: (v) => v || null },
    'contactId': { dbColumn: 'contact_id', required: false, transform: (v) => v || null },
    'assigneeId': { dbColumn: 'assignee_id', required: false, transform: (v) => v || null },
    'teamId': { dbColumn: 'team_id', required: false, transform: (v) => v || null },
    'productId': { dbColumn: 'product_id', required: false, transform: (v) => v || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed)
    'customFields': null,
    'attachments': null,
    'comments': null,
    'timeEntries': null,
    'tasks': null,
    'calls': null,
    'events': null,
    'tags': null,
    'isSpam': null,
    'isDeleted': null,
    'webUrl': null,
    'contact': null, // Object, extract contact_id above
  };

  static transformToDbRecord(zohoTicket) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoTicket[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    // Extract contact_id from contact object if not already set
    if (!record.contact_id && zohoTicket.contact?.id) {
      record.contact_id = zohoTicket.contact.id;
    }

    return record;
  }

  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    // Desk API returns data in 'data' array
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
