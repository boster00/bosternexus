/**
 * BooksBillItemEntity
 * 
 * Entity definition for Zoho Books Bill Line Items.
 */

export class BooksBillItemEntity {
  static tableName = 'zoho_books_bill_items';
  static zohoIdField = 'line_item_id';
  static service = 'books';

  static fieldMappings = {
    'line_item_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'item_id': { dbColumn: 'item_id', required: false, transform: (v) => v || null },
    'sku': { dbColumn: 'sku', required: false, transform: (v) => v || null },
    'name': { dbColumn: 'name', required: false, transform: (v) => v || null },
    'description': { dbColumn: 'description', required: false, transform: (v) => v || null },
    'quantity': { dbColumn: 'quantity', required: false, transform: (v) => v != null ? Number(v) : null },
    'rate': { dbColumn: 'rate', required: false, transform: (v) => v != null ? Number(v) : null },
    'total': { dbColumn: 'total', required: false, transform: (v) => v != null ? Number(v) : null },
    
    // Ignored fields
    'item_total': null,
    'item_custom_fields': null,
    'product_type': null,
    'tax_id': null,
    'tax_name': null,
    'tax_type': null,
    'tax_percentage': null,
    'item_tax': null,
    'discount': null,
    'discount_amount': null,
    'unit': null,
    'bcy_rate': null,
    'bcy_total': null,
    'bcy_tax': null,
    'purchase_rate': null,
    'purchase_description': null,
    'account_id': null,
    'account_name': null,
    'project_id': null,
    'project_name': null,
    'expense_id': null,
    'expense_name': null,
    'tags': null,
    'line_item_index': null,
  };

  static transformToDbRecord(zohoLineItem, relatedBillId) {
    const record = {
      related_bill_id: relatedBillId,
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue;

      const zohoValue = zohoLineItem[zohoField];
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    return record;
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
