/**
 * ZohoOrchestrator
 * 
 * Orchestration service for Zoho operations.
 * Provides unified interface for list, transform, upsert, and sync operations.
 */

import zoho from '@/libs/zoho';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';

export class ZohoOrchestrator {
  constructor() {
    this.zoho = zoho;
    // Use DAL with service role for Zoho syncs (system-level, not user-specific)
    this.dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // Zoho data is system-level, not user-specific
      autoTimestamps: true, // Auto-manage synced_at, created_at, updated_at
    });
  }

  /**
   * List entities from Zoho and return raw Zoho payloads
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {object} params - Query parameters (per_page, page, etc.)
   * @param {string} userId - User ID (optional, for user-specific tokens)
   * @returns {Promise<Array>} Array of Zoho payloads
   */
  async list(EntityClass, params = {}, userId = null) {
    try {
      const { service, apiEndpoint } = EntityClass;
      
      // Build method name based on service and endpoint
      let methodName;
      let response;
      
      if (service === 'books') {
        if (apiEndpoint === '/items') {
          methodName = 'getBooksItems';
        } else if (apiEndpoint === '/invoices') {
          methodName = 'getBooksInvoices';
        } else if (apiEndpoint === '/salesorders') {
          methodName = 'getBooksSalesOrders';
        } else if (apiEndpoint === '/purchaseorders') {
          methodName = 'getBooksPurchaseOrders';
        } else if (apiEndpoint === '/bills') {
          methodName = 'getBooksBills';
        } else {
          // Generic books endpoint
          methodName = null;
        }
        
        if (methodName && this.zoho[methodName]) {
          response = await this.zoho[methodName](params, userId);
        } else {
          response = await this.zoho.get(service, apiEndpoint, params, userId);
        }
      } else if (service === 'crm') {
        // For CRM, extract module name from apiEndpoint (e.g., '/Contacts' -> 'Contacts')
        // CRM API endpoint format: /{module_api_name}
        const moduleName = apiEndpoint.replace('/', ''); // Remove leading slash
        if (moduleName) {
          response = await this.zoho.getCrmRecords(moduleName, params, userId);
        } else {
          throw new Error(`Invalid CRM endpoint: ${apiEndpoint}`);
        }
      } else if (service === 'desk') {
        // For Desk, use generic get method with endpoint
        // Desk API endpoints: /tickets, /contacts, /departments, /agents
        response = await this.zoho.get(service, apiEndpoint, params, userId);
      } else {
        // Unknown service, use generic get
        response = await this.zoho.get(service, apiEndpoint, params, userId);
      }

      // Extract data array from response using entity method
      // The entity knows how to handle both list responses (plural key) and single record responses (singular key)
      const extracted = EntityClass.extractFromResponse ? EntityClass.extractFromResponse(response) : null;
      
      if (extracted !== null && Array.isArray(extracted) && extracted.length > 0) {
        return extracted;
      }

      // Fallback: if entity doesn't have extractFromResponse, use legacy logic
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // If response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }

      // If no array found, return empty array
      Logger.warn(`No data array found in response for ${EntityClass.name}`, { 
        entity: EntityClass.name,
        service: EntityClass.service,
        endpoint: EntityClass.apiEndpoint,
        response 
      });
      return [];
    } catch (error) {
      Logger.error(`Error listing ${EntityClass.name}`, error, {
        entity: EntityClass.name,
        service: EntityClass.service,
        endpoint: EntityClass.apiEndpoint,
        params
      });
      throw error;
    }
  }

  /**
   * Transform Zoho payloads to DB records using entity mappings
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {Array} zohoPayloads - Array of Zoho payloads
   * @returns {Array} Array of DB-ready records
   */
  transform(EntityClass, zohoPayloads) {
    if (!Array.isArray(zohoPayloads)) {
      return [];
    }

    return zohoPayloads.map((payload, index) => {
      try {
        return EntityClass.transformToDbRecord(payload);
      } catch (error) {
        Logger.error(`Error transforming record ${index} for ${EntityClass.name}`, error, {
          entity: EntityClass.name,
          recordIndex: index,
          zohoId: payload?.item_id || payload?.id || 'unknown'
        });
        // Return null for failed transformations, will be filtered out
        return null;
      }
    }).filter(record => record !== null); // Remove failed transformations
  }

  /**
   * Upsert records to database
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {Array} records - Array of DB-ready records
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Upsert result with synced count and errors
   */
  async upsert(EntityClass, records, userId = null) {
    const tableName = EntityClass.tableName;
    const zohoIdField = EntityClass.zohoIdField;
    const conflictColumn = 'zoho_id'; // Database column name for conflict resolution

    if (!records || records.length === 0) {
      return {
        synced: 0,
        errors: [],
      };
    }

    const errors = [];
    let synced = 0;

    // Deduplicate records by zoho_id (keep the last occurrence)
    // This prevents duplicate zoho_id values in the same batch
    const seenIds = new Map();
    const deduplicatedRecords = [];
    for (let i = records.length - 1; i >= 0; i--) {
      const record = records[i];
      const zohoId = record[conflictColumn];
      if (zohoId && !seenIds.has(zohoId)) {
        seenIds.set(zohoId, true);
        deduplicatedRecords.unshift(record); // Add to front to maintain order
      } else if (zohoId && seenIds.has(zohoId)) {
        // Duplicate found - log warning but don't add to errors (upsert will handle it)
        Logger.warn(`Duplicate zoho_id found in batch`, {
          zohoId,
          entity: EntityClass.name,
          table: tableName
        });
      }
    }

    // Process records in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < deduplicatedRecords.length; i += batchSize) {
      const batch = deduplicatedRecords.slice(i, i + batchSize);

      try {
        // Validate records before upserting
        const validRecords = [];
        for (const record of batch) {
          const validation = EntityClass.validateRecord(record);
          if (!validation.valid) {
            errors.push({
              record: record[conflictColumn] || 'unknown',
              error: `Missing required fields: ${validation.missing.join(', ')}`,
            });
            continue;
          }
          validRecords.push(record);
        }

        if (validRecords.length === 0) {
          continue;
        }

        // Additional deduplication check within batch (safety measure)
        const batchSeenIds = new Set();
        const uniqueBatchRecords = validRecords.filter(record => {
          const zohoId = record[conflictColumn];
          if (batchSeenIds.has(zohoId)) {
            Logger.warn(`Duplicate zoho_id in batch`, {
              zohoId,
              entity: EntityClass.name,
              table: tableName,
              batchNumber: Math.floor(i / batchSize) + 1
            });
            return false;
          }
          batchSeenIds.add(zohoId);
          return true;
        });

        if (uniqueBatchRecords.length === 0) {
          continue;
        }

        // Upsert with conflict on zoho_id using DAL
        try {
          const { data, error } = await this.dal.upsert(tableName, uniqueBatchRecords, {
            onConflict: conflictColumn,
          });

          if (error) {
            // If batch upsert fails, try individual upserts
            Logger.warn(`Batch upsert failed, trying individual upserts`, {
              entity: EntityClass.name,
              table: tableName,
              batchNumber: Math.floor(i / batchSize) + 1,
              batchSize: uniqueBatchRecords.length,
              error: error.message
            });
            
            for (const record of uniqueBatchRecords) {
              try {
                const { error: singleError } = await this.dal.upsert(tableName, record, {
                  onConflict: conflictColumn,
                });

                if (singleError) {
                  errors.push({
                    record: record[conflictColumn] || 'unknown',
                    error: singleError.message,
                  });
                } else {
                  synced++;
                }
              } catch (singleErr) {
                errors.push({
                  record: record[conflictColumn] || 'unknown',
                  error: singleErr.message,
                });
              }
            }
          } else {
            synced += data ? data.length : uniqueBatchRecords.length;
          }
        } catch (upsertError) {
          // If DAL throws an error, add to errors
          Logger.error(`Error in upsert batch operation`, upsertError, {
            entity: EntityClass.name,
            table: tableName,
            batchNumber: Math.floor(i / batchSize) + 1
          });
          errors.push({
            record: 'batch',
            error: upsertError.message,
          });
        }
      } catch (batchError) {
        Logger.error(`Error upserting batch ${i / batchSize + 1}`, batchError, {
          entity: EntityClass.name,
          table: tableName,
          batchNumber: Math.floor(i / batchSize) + 1,
          batchSize: uniqueBatchRecords.length
        });
        // Add all records in batch to errors
        uniqueBatchRecords.forEach(record => {
          errors.push({
            record: record[conflictColumn] || 'unknown',
            error: batchError.message,
          });
        });
      }
    }

      Logger.info(`Upsert completed for ${EntityClass.name}`, {
        entity: EntityClass.name,
        table: tableName,
        synced,
        errors: errors.length,
        total: records.length
      });

      return {
        synced,
        errors,
        total: records.length,
      };
  }

  /**
   * Complete workflow: list → transform → upsert
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {object} listParams - Parameters for list API call
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Result with synced count, errors, and summary
   */
  async sync(EntityClass, listParams = {}, userId = null) {
    try {
      Logger.info(`Starting sync for ${EntityClass.name}`, {
        entity: EntityClass.name,
        params: listParams,
        userId
      });

      // Step 1: List from Zoho
      const zohoPayloads = await this.list(EntityClass, listParams, userId);

      if (zohoPayloads.length === 0) {
        Logger.info(`No records found in Zoho for ${EntityClass.name}`, {
          entity: EntityClass.name
        });
        return {
          success: true,
          synced: 0,
          errors: [],
          summary: 'No records found in Zoho',
        };
      }

      Logger.info(`Retrieved ${zohoPayloads.length} records from Zoho for ${EntityClass.name}`, {
        entity: EntityClass.name,
        count: zohoPayloads.length
      });

      // Step 2: Transform to DB records
      const dbRecords = this.transform(EntityClass, zohoPayloads);

      if (dbRecords.length === 0) {
        Logger.error(`All records failed transformation for ${EntityClass.name}`, null, {
          entity: EntityClass.name,
          zohoPayloadCount: zohoPayloads.length
        });
        return {
          success: false,
          synced: 0,
          errors: [{ error: 'All records failed transformation' }],
          summary: 'Failed to transform any records',
        };
      }

      Logger.info(`Transformed ${dbRecords.length} of ${zohoPayloads.length} records for ${EntityClass.name}`, {
        entity: EntityClass.name,
        transformed: dbRecords.length,
        total: zohoPayloads.length
      });

      // Step 3: Upsert to database
      const upsertResult = await this.upsert(EntityClass, dbRecords, userId);

      const result = {
        success: upsertResult.errors.length === 0,
        synced: upsertResult.synced,
        errors: upsertResult.errors,
        total: zohoPayloads.length,
        transformed: dbRecords.length,
        summary: `Synced ${upsertResult.synced} of ${zohoPayloads.length} records`,
      };

      if (result.success) {
        Logger.info(`Sync completed successfully for ${EntityClass.name}`, {
          entity: EntityClass.name,
          synced: result.synced,
          total: result.total
        });
      } else {
        Logger.warn(`Sync completed with errors for ${EntityClass.name}`, {
          entity: EntityClass.name,
          synced: result.synced,
          total: result.total,
          errors: result.errors.length
        });
      }

      return result;
    } catch (error) {
      Logger.error(`Error syncing ${EntityClass.name}`, error, {
        entity: EntityClass.name,
        params: listParams,
        userId
      });
      return {
        success: false,
        synced: 0,
        errors: [{ error: error.message }],
        summary: `Sync failed: ${error.message}`,
      };
    }
  }
}
