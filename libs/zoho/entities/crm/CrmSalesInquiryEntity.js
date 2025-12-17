/**
 * CrmSalesInquiryEntity
 * 
 * Entity definition for Zoho CRM Sales Inquiries (custom module).
 */

export class CrmSalesInquiryEntity {
  static tableName = 'zoho_crm_sales_inquiries';
  static zohoIdField = 'id';
  static apiEndpoint = '/Sales_Inquiries';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'Email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'Traffic_Source': { dbColumn: 'traffic_source', required: false, transform: (v) => v || null },
    'Buying_Timeline': { dbColumn: 'buying_timeline', required: false, transform: (v) => v || null },
    'Free_Validation_Stage': { dbColumn: 'free_validation_stage', required: false, transform: (v) => v || null },
    'Type': { dbColumn: 'type', required: false, transform: (v) => v || null },
    'Follow_Up_Date': { dbColumn: 'follow_up_date', required: false, transform: (v) => v || null },
    'Record_Status__s': { dbColumn: 'record_status', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Last_Activity_Time': { dbColumn: 'last_activity_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Contact': { dbColumn: 'contact_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed later)
    'Biomarkers': null,
    'Results_Report': null,
    'Results_Details': null,
    'Results_Summary': null,
    'Experiment_Details': null,
    'US_Call': null,
    'To_Call': null,
    'Outreach_Stage': null,
    'Project_Initiation_Checklist': null,
    'Related_Sales_Orders': null,
    'Description': null,
    'Tag': null,
  };

  static transformToDbRecord(zohoSalesInquiry) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoSalesInquiry[zohoField];
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
