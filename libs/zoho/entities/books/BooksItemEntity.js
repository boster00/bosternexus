/**
 * BooksItemEntity
 * 
 * Entity definition for Zoho Books Items.
 * Defines field mappings, transformations, and table structure.
 */

export class BooksItemEntity {
  static tableName = 'zoho_books_items';
  static zohoIdField = 'item_id';
  static apiEndpoint = '/items';
  static service = 'books';

  /**
   * Field mappings from Zoho API to database columns
   * Format: 'zoho_field': { dbColumn: 'db_column', required: boolean, transform: function|null }
   * Set to null to ignore the field
   */
  static fieldMappings = {
    'item_id': { dbColumn: 'zoho_id', required: true, transform: null },
    'name': { dbColumn: 'name', required: true, transform: null },
    'status': { dbColumn: 'status', required: true, transform: null },
    'zcrm_product_id': { dbColumn: 'zcrm_product_id', required: false, transform: (v) => v || null },
    'description': { dbColumn: 'description', required: false, transform: (v) => v || null },
    'rate': { dbColumn: 'rate', required: false, transform: (v) => v != null ? Number(v) : null },
    'purchase_description': { dbColumn: 'purchase_description', required: false, transform: (v) => v || null },
    'purchase_rate': { dbColumn: 'purchase_rate', required: false, transform: (v) => v != null ? Number(v) : null },
    'item_type': { dbColumn: 'item_type', required: true, transform: null },
    'product_type': { dbColumn: 'product_type', required: true, transform: null },
    'stock_on_hand': { dbColumn: 'stock_on_hand', required: false, transform: (v) => v != null ? Number(v) : 0 },
    'available_stock': { dbColumn: 'available_stock', required: false, transform: (v) => v != null ? Number(v) : 0 },
    'actual_available_stock': { dbColumn: 'actual_available_stock', required: false, transform: (v) => v != null ? Number(v) : 0 },
    'sku': { dbColumn: 'sku', required: false, transform: (v) => v || null },
    'reorder_level': { dbColumn: 'reorder_level', required: false, transform: (v) => {
      if (v === null || v === undefined || v === '') return null;
      return Number(v);
    }},
    'can_be_sold': { dbColumn: 'can_be_sold', required: false, transform: (v) => v === true },
    'can_be_purchased': { dbColumn: 'can_be_purchased', required: false, transform: (v) => v === true },
    'track_inventory': { dbColumn: 'track_inventory', required: false, transform: (v) => v === true },
    'is_linked_with_zohocrm': { dbColumn: 'is_linked_with_zohocrm', required: false, transform: (v) => v === true },
    'created_time': { dbColumn: 'created_time', required: false, transform: (v) => v || null },
    'last_modified_time': { dbColumn: 'last_modified_time', required: false, transform: (v) => v || null },
    
    // Ignored fields (set to null)
    'item_name': null,
    'unit': null,
    'source': null,
    'is_combo_product': null,
    'brand': null,
    'manufacturer': null,
    'tax_id': null,
    'tax_name': null,
    'tax_percentage': null,
    'purchase_account_id': null,
    'purchase_account_name': null,
    'account_id': null,
    'account_name': null,
    'has_attachment': null,
    'is_returnable': null,
    'image_name': null,
    'image_type': null,
    'image_document_id': null,
    'upc': null,
    'ean': null,
    'isbn': null,
    'part_number': null,
    'length': null,
    'width': null,
    'height': null,
    'weight': null,
    'weight_unit': null,
    'dimension_unit': null,
    'dimensions_with_unit': null,
    'weight_with_unit': null,
    'tags': null,
  };

  /**
   * Transform Zoho payload to database record
   * @param {object} zohoItem - Raw item from Zoho API
   * @returns {object} Database-ready record
   */
  static transformToDbRecord(zohoItem) {
    const record = {
      synced_at: new Date().toISOString(),
    };

    for (const [zohoField, mapping] of Object.entries(this.fieldMappings)) {
      if (mapping === null) continue; // Ignored field

      const zohoValue = zohoItem[zohoField];
      
      // Apply transformation if provided
      const transformedValue = mapping.transform 
        ? mapping.transform(zohoValue)
        : zohoValue;

      // Only set if value is not undefined (allow null)
      if (transformedValue !== undefined) {
        record[mapping.dbColumn] = transformedValue;
      }
    }

    return record;
  }

  /**
   * Get list of required fields
   * @returns {Array<string>} Array of required field names
   */
  static getRequiredFields() {
    return Object.entries(this.fieldMappings)
      .filter(([_, mapping]) => mapping !== null && mapping.required)
      .map(([zohoField, mapping]) => mapping.dbColumn);
  }

  /**
   * Validate that a record has all required fields
   * @param {object} record - Database record
   * @returns {object} { valid: boolean, missing: Array<string> }
   */
  static validateRecord(record) {
    const required = this.getRequiredFields();
    const missing = required.filter(field => record[field] === null || record[field] === undefined);

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Extract item data from Zoho API response
   * Handles both list responses (plural key) and single record responses (singular key)
   * @param {object} response - Raw Zoho API response
   * @returns {Array} Array of item objects (always returns array, even for single records)
   */
  static extractFromResponse(response) {
    if (!response || typeof response !== 'object') {
      return [];
    }

    // Derive module names from apiEndpoint
    // /items -> plural: 'items', singular: 'item'
    const pluralName = this.apiEndpoint.replace('/', ''); // 'items'
    const singularName = pluralName.slice(0, -1); // 'item' (remove 's')

    // Check 1: Plural key (array) - normal list response
    if (response[pluralName] && Array.isArray(response[pluralName])) {
      return response[pluralName];
    }

    // Check 2: Singular key (object) - single record response, wrap in array
    if (response[singularName] && typeof response[singularName] === 'object' && !Array.isArray(response[singularName])) {
      return [response[singularName]];
    }

    // Check 3: Fallback to normalized data array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // Check 4: Fallback to data as single object (wrap in array)
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }

    // No valid response structure found
    return [];
  }
}
