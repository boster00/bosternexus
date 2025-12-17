/**
 * CrmServiceProjectEntity
 * 
 * Entity definition for Zoho CRM Service Projects (custom module).
 */

export class CrmServiceProjectEntity {
  static tableName = 'zoho_crm_service_projects';
  static zohoIdField = 'id';
  static apiEndpoint = '/Service_Projects';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'Email': { dbColumn: 'email', required: false, transform: (v) => v || null },
    'Project_Number': { dbColumn: 'project_number', required: false, transform: (v) => v || null },
    'Stage': { dbColumn: 'stage', required: false, transform: (v) => v || null },
    'Custom_Ab_Stage': { dbColumn: 'custom_ab_stage', required: false, transform: (v) => v || null },
    'Project_Type': { dbColumn: 'project_type', required: false, transform: (v) => v || null },
    'Expected_Start_Date': { dbColumn: 'expected_start_date', required: false, transform: (v) => v || null },
    'Invoice': { dbColumn: 'invoice', required: false, transform: (v) => v || null },
    'Sales_Order': { dbColumn: 'sales_order', required: false, transform: (v) => v || null },
    'Bill': { dbColumn: 'bill', required: false, transform: (v) => v || null },
    'Purchase_Order': { dbColumn: 'purchase_order', required: false, transform: (v) => v || null },
    'Currency': { dbColumn: 'currency', required: false, transform: (v) => v || null },
    'Exchange_Rate': { dbColumn: 'exchange_rate', required: false, transform: (v) => v != null ? Number(v) : null },
    'Sub_Total': { dbColumn: 'sub_total', required: false, transform: (v) => v != null ? Number(v) : null },
    'Cost_Total': { dbColumn: 'cost_total', required: false, transform: (v) => v != null ? Number(v) : null },
    'SKU': { dbColumn: 'sku', required: false, transform: (v) => v || null },
    'Record_Status__s': { dbColumn: 'record_status', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Last_Activity_Time': { dbColumn: 'last_activity_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    'Contact': { dbColumn: 'contact_id', required: false, transform: (v) => v?.id || null },
    'Service_Vendor': { dbColumn: 'service_vendor_id', required: false, transform: (v) => v?.id || null },
    'Opportunity': { dbColumn: 'opportunity_id', required: false, transform: (v) => v?.id || null },
    'Reference_Quote': { dbColumn: 'reference_quote_id', required: false, transform: (v) => v?.id || null },
    'Parent_Project': { dbColumn: 'parent_project_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields (can be stored in metadata JSONB if needed later)
    'Project_Summary': null,
    'Project_Scope': null,
    'Project_Initiation_Checklist': null,
    'Project_Closing_Checklist': null,
    'Project_Cancellation_Checklist': null,
    'Project_Scope_Change_Checklist': null,
    'Project_Phases': null,
    'Protein_Production_Stage': null,
    // Line items stored as JSONB (CRM line items are custom-defined per module and not used for calculations)
    'Line_Items': { dbColumn: 'line_items', required: false, transform: (v) => Array.isArray(v) ? JSON.stringify(v) : null },
    'Tag': null,
    'Description': null,
  };

  static transformToDbRecord(zohoServiceProject) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoServiceProject[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    // Handle Line_Items as JSONB (already transformed above, but ensure it's valid JSON)
    if (record.line_items && typeof record.line_items === 'string') {
      try {
        JSON.parse(record.line_items); // Validate it's valid JSON
      } catch (e) {
        // If invalid, set to null
        record.line_items = null;
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
