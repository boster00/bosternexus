/**
 * CrmShipmentEntity
 * 
 * Entity definition for Zoho CRM Shipments (custom module).
 */

export class CrmShipmentEntity {
  static tableName = 'zoho_crm_shipments';
  static zohoIdField = 'id';
  static apiEndpoint = '/Shipments';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'Shipment_Number': { dbColumn: 'shipment_number', required: false, transform: (v) => v || null },
    'Status': { dbColumn: 'status', required: false, transform: (v) => v || null },
    'Shipment_Type': { dbColumn: 'shipment_type', required: false, transform: (v) => v || null },
    'Tracking_Number': { dbColumn: 'tracking_number', required: false, transform: (v) => v || null },
    'ETA': { dbColumn: 'eta', required: false, transform: (v) => v || null },
    'Vendor_Email': { dbColumn: 'vendor_email', required: false, transform: (v) => v || null },
    'Record_Status__s': { dbColumn: 'record_status', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Last_Activity_Time': { dbColumn: 'last_activity_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Customer': { dbColumn: 'customer_id', required: false, transform: (v) => v?.id || null },
    'Vendor': { dbColumn: 'vendor_id', required: false, transform: (v) => v?.id || null },
    'Quote': { dbColumn: 'quote_id', required: false, transform: (v) => v?.id || null },
    'Project': { dbColumn: 'project_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed later)
    'Content_Description': null,
    'Shipment_Checklist': null,
    'Tag': null,
    'Description': null,
  };

  static transformToDbRecord(zohoShipment) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoShipment[zohoField];
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
