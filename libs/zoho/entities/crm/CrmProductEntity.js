/**
 * CrmProductEntity
 * 
 * Entity definition for Zoho CRM Products.
 */

export class CrmProductEntity {
  static tableName = 'zoho_crm_products';
  static zohoIdField = 'id';
  static apiEndpoint = '/Products';
  static service = 'crm';

  static fieldMappings = {
    'id': { dbColumn: 'zoho_id', required: true, transform: null },
    'Product_Name': { dbColumn: 'product_name', required: false, transform: (v) => v || null },
    'Product_Code': { dbColumn: 'product_code', required: false, transform: (v) => v || null },
    'Unit_Price': { dbColumn: 'unit_price', required: false, transform: (v) => v != null ? Number(v) : null },
    'Stock_Quantity': { dbColumn: 'stock_quantity', required: false, transform: (v) => v != null ? Number(v) : null },
    'Description': { dbColumn: 'description', required: false, transform: (v) => v || null },
    'Created_Time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'Modified_Time': { dbColumn: 'modified_time', required: false, transform: (v) => v || null },
    'Owner': { dbColumn: 'owner_id', required: false, transform: (v) => v?.id || null },
    
    // Ignored fields
    'Product_Category': null,
    'Tax': null,
    'Commission_Rate': null,
    'Qty_in_Demand': null,
    'Qty_in_Stock': null,
    'Reorder_Level': null,
    'Handler': null,
    'Vendor_Name': null,
  };

  static transformToDbRecord(zohoProduct) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoProduct[zohoField];
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
