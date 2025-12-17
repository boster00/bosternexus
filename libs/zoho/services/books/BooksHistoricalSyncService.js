/**
 * BooksHistoricalSyncService
 * 
 * Service for syncing historical Zoho Books transaction data.
 * Handles resumable sync with configurable date ranges.
 */

import zoho from '@/libs/zoho';
import { ZohoOrchestrator } from '@/libs/zoho/orchestration/ZohoOrchestrator';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';
import {
  BooksInvoiceEntity,
  BooksSalesOrderEntity,
  BooksPurchaseOrderEntity,
  BooksBillEntity,
  BooksLineItemEntity,
} from '@/libs/zoho/entities/books';

export class BooksHistoricalSyncService {
  constructor() {
    this.orchestrator = new ZohoOrchestrator();
    this.dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false,
      autoTimestamps: false, // We manage timestamps manually
    });
    
    // Module configuration
    // Note: sort_column 'date' is valid for all transaction modules (salesorders, invoices, purchaseorders, bills)
    // Other valid sort columns per module:
    // - salesorders: customer_name, salesorder_number, shipment_date, last_modified_time, reference_number, total, date, created_time
    // - invoices: customer_name, invoice_number, date, due_date, total, created_time, last_modified_time
    // - purchaseorders: vendor_name, purchaseorder_number, date, delivery_date, total, created_time, last_modified_time
    // - bills: vendor_name, bill_number, date, due_date, total, created_time, last_modified_time
    // All modules now use the unified BooksLineItemEntity
    this.modules = [
      { name: 'salesorders', entity: BooksSalesOrderEntity, itemEntity: BooksLineItemEntity, sortColumn: 'date', parentType: 'salesorder' },
      { name: 'invoices', entity: BooksInvoiceEntity, itemEntity: BooksLineItemEntity, sortColumn: 'date', parentType: 'invoice' },
      { name: 'purchaseorders', entity: BooksPurchaseOrderEntity, itemEntity: BooksLineItemEntity, sortColumn: 'date', parentType: 'purchaseorder' },
      { name: 'bills', entity: BooksBillEntity, itemEntity: BooksLineItemEntity, sortColumn: 'date', parentType: 'bill' },
    ];
  }

  /**
   * Get oldest transaction date for a module
   * @param {string} moduleName - Module name (e.g., 'invoices')
   * @returns {Promise<Date|null>} Oldest date or null if no records
   */
  async getOldestTransactionDate(moduleName) {
    const moduleConfig = this.modules.find(m => m.name === moduleName);
    if (!moduleConfig) {
      throw new Error(`Unknown module: ${moduleName}`);
    }

    const tableName = moduleConfig.entity.tableName;
    
    try {
      const { data, error } = await this.dal.select(tableName, {
        queryBuilder: (query) => {
          return query
            .select('date')
            .not('date', 'is', null)
            .order('date', { ascending: true })
            .limit(1);
        },
        single: true,
      });

      if (error) {
        Logger.error(`Error getting oldest transaction date for ${moduleName}`, error);
        return null;
      }

      if (!data || !data.date) {
        return null;
      }

      return new Date(data.date);
    } catch (error) {
      Logger.error(`Error querying oldest transaction date for ${moduleName}`, error);
      return null;
    }
  }

  /**
   * Get latest transaction date for a module (for UI display)
   * Uses synced_at to show when records were last synced (most accurate)
   * Falls back to last_modified_time if synced_at is not available
   * @param {string} moduleName - Module name
   * @returns {Promise<Date|null>} Latest sync/modified date or null if no records
   */
  async getLatestTransactionDate(moduleName) {
    const moduleConfig = this.modules.find(m => m.name === moduleName);
    if (!moduleConfig) {
      return null;
    }

    const tableName = moduleConfig.entity.tableName;
    
    try {
      // First try to get synced_at (most accurate for when we last synced)
      const { data, error } = await this.dal.select(tableName, {
        queryBuilder: (query) => {
          return query
            .select('synced_at, last_modified_time')
            .not('synced_at', 'is', null)
            .order('synced_at', { ascending: false })
            .limit(1);
        },
        single: true,
      });

      if (error || !data) {
        return null;
      }

      // Prefer synced_at, fallback to last_modified_time
      const timestamp = data.synced_at || data.last_modified_time;
      if (!timestamp) {
        return null;
      }

      // Ensure we create a Date object from UTC timestamp
      // PostgreSQL TIMESTAMPTZ is returned as ISO string with timezone
      const date = new Date(timestamp);
      
      // Verify it's a valid date
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check which zoho_ids already exist in database
   * @param {string} tableName - Table name
   * @param {Array<string>} zohoIds - Array of zoho_ids to check
   * @returns {Promise<Set<string>>} Set of existing zoho_ids
   */
  async checkExistingRecords(tableName, zohoIds) {
    if (!zohoIds || zohoIds.length === 0) {
      return new Set();
    }

    try {
      const { data, error } = await this.dal.select(tableName, {
        queryBuilder: (query) => {
          return query
            .select('zoho_id')
            .in('zoho_id', zohoIds);
        },
      });

      if (error) {
        Logger.error(`Error checking existing records in ${tableName}`, error);
        return new Set();
      }

      return new Set((data || []).map(record => record.zoho_id));
    } catch (error) {
      Logger.error(`Error querying existing records in ${tableName}`, error);
      return new Set();
    }
  }

  /**
   * Get existing record with last_modified_time
   * @param {string} tableName - Table name
   * @param {string} zohoId - Zoho ID
   * @returns {Promise<object|null>} Record with last_modified_time or null
   */
  async getExistingRecord(tableName, zohoId) {
    try {
      const { data, error } = await this.dal.select(tableName, {
        queryBuilder: (query) => {
          return query
            .select('zoho_id, last_modified_time')
            .eq('zoho_id', zohoId)
            .limit(1);
        },
        single: true,
      });

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch individual transaction with line items
   * @param {object} moduleConfig - Module configuration
   * @param {string} zohoId - Zoho ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object|null>} Full transaction with line items
   */
  async fetchTransactionWithLineItems(moduleConfig, zohoId, userId = null) {
    try {
      const endpoint = `${moduleConfig.entity.apiEndpoint}/${zohoId}`;
      const response = await zoho.get('books', endpoint, {}, userId);
      
      // Extract data from response using entity method (handles both list and single record responses)
      const extracted = moduleConfig.entity.extractFromResponse(response);
      const transactionData = extracted.length > 0 ? extracted[0] : null;
      
      if (!transactionData) {
        Logger.warn(`No transaction data extracted for ${zohoId}`, {
          moduleName: moduleConfig.name,
          responseKeys: response ? Object.keys(response) : null
        });
      }
      
      // Return both the transaction data and the raw response
      return {
        transaction: transactionData,
        rawZohoResponse: response, // Store the full normalized response (which contains the raw Zoho JSON structure)
      };
    } catch (error) {
      Logger.error(`Error fetching transaction ${zohoId} for ${moduleConfig.name}`, error);
      return null;
    }
  }

  /**
   * Get comments for a transaction
   * @param {object} moduleConfig - Module configuration
   * @param {string} zohoId - Zoho ID
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object|null>} Comments response from Zoho API
   */
  async getTransactionComments(moduleConfig, zohoId, userId = null) {
    try {
      const endpoint = `${moduleConfig.entity.apiEndpoint}/${zohoId}/comments`;
      const response = await zoho.get('books', endpoint, {}, userId);
      return response;
    } catch (error) {
      Logger.warn(`Error fetching comments for transaction ${zohoId} in ${moduleConfig.name}`, error);
      // Don't throw - comments are optional, return null on error
      return null;
    }
  }

  /**
   * Extract email addresses from comments response
   * Converts the entire response to JSON string, extracts emails using regex,
   * and filters out emails with bosterbio.com domain
   * @param {object} commentsResponse - Raw comments response from Zoho API
   * @returns {string|null} Comma-separated email addresses (excluding bosterbio.com) or null
   */
  extractEmailsFromComments(commentsResponse) {
    if (!commentsResponse || typeof commentsResponse !== 'object') {
      return null;
    }

    try {
      // Convert entire response to JSON string
      const jsonString = JSON.stringify(commentsResponse);
      
      // Regex pattern to match email addresses
      // Matches: word characters, dots, hyphens, plus signs, and @ symbol
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      
      // Extract all email addresses
      const matches = jsonString.match(emailRegex);
      
      if (!matches || matches.length === 0) {
        return null;
      }

      // Remove duplicates and filter out bosterbio.com emails
      const uniqueEmails = [...new Set(matches)]
        .map(email => email.toLowerCase())
        .filter(email => !email.endsWith('@bosterbio.com') && !email.endsWith('@bosterbio.com'.toLowerCase()));

      if (uniqueEmails.length === 0) {
        return null;
      }

      // Return comma-separated list of emails
      return uniqueEmails.join(',');
    } catch (error) {
      Logger.warn('Error extracting emails from comments', error);
      return null;
    }
  }

  /**
   * Sync line items for a transaction
   * @param {object} moduleConfig - Module configuration
   * @param {string} parentId - UUID of parent transaction in database
   * @param {Array} lineItems - Array of line items from Zoho
   * @returns {Promise<object>} Result with synced count and errors
   */
  async syncLineItems(moduleConfig, parentId, lineItems) {
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return { synced: 0, errors: [] };
    }

    const itemEntity = moduleConfig.itemEntity;
    const tableName = itemEntity.tableName;
    const parentType = moduleConfig.parentType; // 'invoice', 'salesorder', 'purchaseorder', or 'bill'
    const errors = [];
    let synced = 0;

    // Transform line items using unified entity with parent_id and parent_type
    const dbRecords = lineItems
      .map(item => {
        try {
          return itemEntity.transformToDbRecord(item, parentId, parentType);
        } catch (error) {
          Logger.error(`Error transforming line item for ${moduleConfig.name}`, error);
          errors.push({
            record: item.line_item_id || 'unknown',
            error: error.message,
          });
          return null;
        }
      })
      .filter(record => record !== null);

    if (dbRecords.length === 0) {
      return { synced: 0, errors };
    }

    // Handle composite unique constraint (parent_id, parent_type, zoho_id)
    // Delete existing line items for this parent first, then insert new ones
    // This ensures we have the latest line items from Zoho
    // Delete existing line items for this parent (once, before processing batches)
    try {
      await this.dal.delete(tableName, {
        parent_id: parentId,
        parent_type: parentType,
      });
    } catch (deleteError) {
      Logger.warn(`Error deleting existing line items for ${moduleConfig.name}`, deleteError);
      // Continue anyway - individual inserts will handle conflicts
    }

    // Insert line items in batches
    const batchSize = 50;
    for (let i = 0; i < dbRecords.length; i += batchSize) {
      const batch = dbRecords.slice(i, i + batchSize);

      try {
        // Insert batch of line items
        const { data, error } = await this.dal.insert(tableName, batch);

        if (error) {
          // Try individual inserts if batch fails
          for (const record of batch) {
            try {
              const { error: singleError } = await this.dal.insert(tableName, record);
              if (singleError) {
                errors.push({
                  record: record.zoho_id || 'unknown',
                  error: singleError.message,
                });
              } else {
                synced++;
              }
            } catch (singleErr) {
              errors.push({
                record: record.zoho_id || 'unknown',
                error: singleErr.message,
              });
            }
          }
        } else {
          synced += data ? data.length : batch.length;
        }
      } catch (batchError) {
        Logger.error(`Error inserting line items batch for ${moduleConfig.name}`, batchError);
        batch.forEach(record => {
          errors.push({
            record: record.zoho_id || 'unknown',
            error: batchError.message,
          });
        });
      }
    }

    return { synced, errors };
  }

  /**
   * Sync a single batch of transactions
   * @param {object} moduleConfig - Module configuration
   * @param {Array} batch - Array of transaction records from Zoho
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Result with synced count and errors
   */
  async syncBatch(moduleConfig, batch, userId = null) {
    const errors = [];
    let synced = 0;

    // Check which records already exist
    const zohoIds = batch.map(t => t[moduleConfig.entity.zohoIdField]).filter(id => id);
    const existingIds = await this.checkExistingRecords(moduleConfig.entity.tableName, zohoIds);

    // Process each transaction
    for (const transaction of batch) {
      const zohoId = transaction[moduleConfig.entity.zohoIdField];
      if (!zohoId) {
        errors.push({
          record: 'unknown',
          error: 'Missing zoho_id',
        });
        continue;
      }

      const exists = existingIds.has(zohoId);
      let needsUpdate = false;

      if (exists) {
        // Check if record needs updating based on last_modified_time
        const existingRecord = await this.getExistingRecord(moduleConfig.entity.tableName, zohoId);
        if (existingRecord && existingRecord.last_modified_time) {
          const existingTime = new Date(existingRecord.last_modified_time);
          const zohoTime = transaction.last_modified_time ? new Date(transaction.last_modified_time) : null;
          if (zohoTime && zohoTime > existingTime) {
            needsUpdate = true;
          }
        }
      }

      // If record doesn't exist or needs update, fetch full record with line items
      if (!exists || needsUpdate) {
        const fullTransaction = await this.fetchTransactionWithLineItems(moduleConfig, zohoId, userId);
        if (!fullTransaction) {
          errors.push({
            record: zohoId,
            error: 'Failed to fetch full transaction',
          });
          continue;
        }

        // Fetch and extract emails from comments
        let extractedEmail = null;
        try {
          const commentsResponse = await this.getTransactionComments(moduleConfig, zohoId, userId);
          if (commentsResponse) {
            extractedEmail = this.extractEmailsFromComments(commentsResponse);
          }
        } catch (emailError) {
          // Log but don't fail the sync if email extraction fails
          Logger.warn(`Error extracting email from comments for ${zohoId}`, emailError);
        }

        // Transform transaction
        const dbRecord = moduleConfig.entity.transformToDbRecord(fullTransaction.transaction || fullTransaction);
        
        // Add extracted email to the record if found
        if (extractedEmail) {
          dbRecord.email = extractedEmail;
        }

        // Upsert transaction
        try {
          const { data, error } = await this.dal.upsert(moduleConfig.entity.tableName, [dbRecord], {
            onConflict: 'zoho_id',
          });

          if (error) {
            errors.push({
              record: zohoId,
              error: error.message,
            });
            continue;
          }

          // Get the database ID of the upserted transaction
          let dbTransactionId = data && data[0] ? data[0].id : null;
          if (!dbTransactionId) {
            // If upsert didn't return data, query for it
            const { data: queryData } = await this.dal.select(moduleConfig.entity.tableName, {
              queryBuilder: (query) => {
                return query
                  .select('id')
                  .eq('zoho_id', zohoId)
                  .limit(1);
              },
              single: true,
            });
            if (queryData) {
              dbTransactionId = queryData.id;
            }
          }

          if (dbTransactionId && fullTransaction.line_items) {
            // Sync line items
            const lineItemsResult = await this.syncLineItems(
              moduleConfig,
              dbTransactionId,
              fullTransaction.line_items
            );
            synced += lineItemsResult.synced;
            errors.push(...lineItemsResult.errors);
          }

          synced++;
        } catch (upsertError) {
          errors.push({
            record: zohoId,
            error: upsertError.message,
          });
        }
      }
    }

    return { synced, errors };
  }

  /**
   * Sync a single module
   * @param {string} moduleName - Module name
   * @param {number} days - Number of days to sync (default: 7)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Result with synced count and errors
   */
  async syncModule(moduleName, days = 7, userId = null) {
    const moduleConfig = this.modules.find(m => m.name === moduleName);
    if (!moduleConfig) {
      throw new Error(`Unknown module: ${moduleName}`);
    }

    Logger.info(`Starting sync for module: ${moduleName}`, { moduleName, days });

    // Get oldest existing transaction date
    const oldestDate = await this.getOldestTransactionDate(moduleName);
    
    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - days);
    limitDate.setHours(0, 0, 0, 0); // Start of limit date

    // Determine date range for sync
    // Plan: "get records equal or older than that date but earlier than the limit date"
    // We sync from today backwards to the limit date
    // If oldest date exists and is within range, we'll continue from there
    const dateEnd = endDate;
    const dateStart = limitDate;
    
    // If we have an oldest date within the range, we can use it as a starting point
    // But we still sync the full range to ensure we get all records
    // The resumability comes from checking existing records and their modified times

    Logger.info(`Date range for ${moduleName}`, {
      moduleName,
      dateStart: dateStart.toISOString(),
      dateEnd: dateEnd.toISOString(),
      limitDate: limitDate.toISOString(),
      oldestExisting: oldestDate ? oldestDate.toISOString() : 'none',
    });

    const errors = [];
    let synced = 0;
    let page = 1;
    const batchSize = 50;
    let hasMore = true;
    const rawZohoResponses = []; // Store raw Zoho responses for this module

    // Sync going back in time (most recent first, then older)
    // Paginate from most recent to oldest
    while (hasMore) {
      try {
        // Build date filter - Zoho Books uses date_start and date_end parameters
        // Available date filter variants: date_start, date_end, date_before, date_after
        // Date format: yyyy-mm-dd (default format for Zoho Books API)
        // We want records where date >= dateStart AND date <= dateEnd
        // Sort by date descending (most recent first)
        // Note: Zoho Books API expects 'desc' or 'asc', not 'descending' or 'ascending'
        // sort_column 'date' is valid for all transaction modules (salesorders, invoices, purchaseorders, bills)
        const params = {
          per_page: batchSize,
          page: page,
          sort_column: moduleConfig.sortColumn || 'date', // Use module-specific sort column, default to 'date'
          // sort_order: 'desc', // Most recent first (Zoho Books expects 'desc' not 'descending')
        };

        // Add date filter - Zoho Books date filter format: yyyy-mm-dd
        // date_start: Filter records where date >= dateStart
        // date_end: Filter records where date <= dateEnd
        // Using toISOString().split('T')[0] ensures yyyy-mm-dd format
        params.date_start = dateStart.toISOString().split('T')[0];
        params.date_end = dateEnd.toISOString().split('T')[0];

        // Fetch raw response directly from Zoho to get the original JSON structure
        // The path is: result[0].data.salesorders[0] (for salesorders module)
        // So we need: rawResponse.salesorders (or rawResponse[moduleName])
        let rawBatchResponse = null;
        let batch = [];
        try {
          const endpoint = moduleConfig.entity.apiEndpoint;
          const rawResponse = await zoho.get('books', endpoint, params, userId);
          
          // Store the full raw response for display
          rawBatchResponse = rawResponse;
          
          // Extract the actual array from the raw response
          // The raw response structure is: { code: 0, message: "success", salesorders: [...], page_context: {...}, data: [...] }
          // The module-specific key (e.g., 'salesorders') contains the actual array
          // Path: result[0].data.salesorders[0] means we need rawResponse.salesorders
          if (rawResponse && rawResponse[moduleName] && Array.isArray(rawResponse[moduleName])) {
            batch = rawResponse[moduleName];
            Logger.info(`Extracted batch from module-specific key: ${moduleName}`, { 
              count: batch.length,
              firstRecordId: batch[0]?.[moduleConfig.entity.zohoIdField] 
            });
          } else if (rawResponse && rawResponse.data && Array.isArray(rawResponse.data)) {
            // Fallback to normalized data array if module-specific key not found
            batch = rawResponse.data;
            Logger.info(`Extracted batch from normalized data field`, { 
              count: batch.length,
              firstRecordId: batch[0]?.[moduleConfig.entity.zohoIdField] 
            });
          } else {
            Logger.warn(`No array found in raw response for ${moduleName}`, { 
              rawResponseKeys: rawResponse ? Object.keys(rawResponse) : null,
              moduleName,
              apiEndpoint: moduleConfig.entity.apiEndpoint
            });
          }
        } catch (error) {
          Logger.error(`Failed to fetch batch response for ${moduleName} page ${page}`, error);
          hasMore = false;
          break;
        }

        if (!batch || batch.length === 0) {
          hasMore = false;
          break;
        }

        Logger.info(`Fetched batch ${page} for ${moduleName}`, {
          moduleName,
          page,
          count: batch.length,
        });

        // Store raw batch response for display
        if (rawBatchResponse) {
          rawZohoResponses.push({
            type: 'batch',
            page,
            module: moduleName,
            data: rawBatchResponse, // Full response with code, message, salesorders, page_context, data
          });
        }

        // Process records ONE BY ONE: fetch full details, sync completely, then move to next
        // This ensures each record is synced before pulling the next one
        for (let i = 0; i < batch.length; i++) {
          const transaction = batch[i];
          const zohoId = transaction[moduleConfig.entity.zohoIdField];
          
          if (!zohoId) {
            errors.push({
              record: 'unknown',
              error: 'Missing zoho_id',
            });
            continue;
          }

          // Check if record exists or needs update
          const existingIds = await this.checkExistingRecords(moduleConfig.entity.tableName, [zohoId]);
          const exists = existingIds.has(zohoId);
          let needsUpdate = false;

          if (exists) {
            // Check if record needs updating based on last_modified_time
            const existingRecord = await this.getExistingRecord(moduleConfig.entity.tableName, zohoId);
            if (existingRecord && existingRecord.last_modified_time) {
              const existingTime = new Date(existingRecord.last_modified_time);
              const zohoTime = transaction.last_modified_time ? new Date(transaction.last_modified_time) : null;
              if (zohoTime && zohoTime > existingTime) {
                needsUpdate = true;
              }
            }
          }

          // If record doesn't exist or needs update, fetch full record and sync immediately
          if (!exists || needsUpdate) {
            // Fetch full transaction with line items (individual API call)
            const fullTransactionResult = await this.fetchTransactionWithLineItems(moduleConfig, zohoId, userId);
            if (!fullTransactionResult || !fullTransactionResult.transaction) {
              errors.push({
                record: zohoId,
                error: 'Failed to fetch full transaction',
              });
              continue;
            }

            // Store raw Zoho response for this transaction
            if (fullTransactionResult.rawZohoResponse) {
              rawZohoResponses.push({
                type: 'transaction',
                zohoId,
                module: moduleName,
                data: fullTransactionResult.rawZohoResponse,
              });
            }

            const fullTransaction = fullTransactionResult.transaction;

            // Transform transaction
            const dbRecord = moduleConfig.entity.transformToDbRecord(fullTransaction);

            // Upsert transaction immediately (sync before moving to next)
            try {
              const { data, error } = await this.dal.upsert(moduleConfig.entity.tableName, [dbRecord], {
                onConflict: 'zoho_id',
              });

              if (error) {
                errors.push({
                  record: zohoId,
                  error: error.message,
                });
                continue;
              }

              // Get the database ID of the upserted transaction
              let dbTransactionId = data && data[0] ? data[0].id : null;
              if (!dbTransactionId) {
                // If upsert didn't return data, query for it
                const { data: queryData } = await this.dal.select(moduleConfig.entity.tableName, {
                  queryBuilder: (query) => {
                    return query
                      .select('id')
                      .eq('zoho_id', zohoId)
                      .limit(1);
                  },
                  single: true,
                });
                if (queryData) {
                  dbTransactionId = queryData.id;
                }
              }

              // Sync line items immediately after transaction is synced
              if (dbTransactionId && fullTransaction.line_items) {
                const lineItemsResult = await this.syncLineItems(
                  moduleConfig,
                  dbTransactionId,
                  fullTransaction.line_items
                );
                synced += lineItemsResult.synced;
                errors.push(...lineItemsResult.errors);
              }

              synced++;
            } catch (upsertError) {
              errors.push({
                record: zohoId,
                error: upsertError.message,
              });
            }
          }

          // Check if we've reached the limit date (check current record's date)
          // Stop immediately if this record is before or equal to limit date
          const recordDate = transaction.date ? new Date(transaction.date) : null;
          if (recordDate && recordDate <= limitDate) {
            hasMore = false;
            break;
          }
        }

        // If batch is smaller than batchSize, we've reached the end
        if (batch.length < batchSize) {
          hasMore = false;
          break;
        }

        page++;
      } catch (error) {
        Logger.error(`Error syncing batch ${page} for ${moduleName}`, error);
        errors.push({
          record: `batch_${page}`,
          error: error.message,
        });
        hasMore = false; // Stop on error to allow resuming
        break;
      }
    }

    Logger.info(`Completed sync for module: ${moduleName}`, {
      moduleName,
      synced,
      errors: errors.length,
    });

    return {
      synced,
      errors,
      rawZohoResponses, // Include raw Zoho responses for this module
    };
  }

  /**
   * Sync recent transactions for all modules
   * @param {number} days - Number of days to sync (default: 7, UI default: 180)
   * @param {Array<string>} modules - Optional array of module names to sync (default: all)
   * @param {string} userId - User ID (optional)
   * @returns {Promise<object>} Result with synced counts per module and errors
   */
  async syncRecentTransactions(days = 7, modules = null, userId = null) {
    const modulesToSync = modules || this.modules.map(m => m.name);
    const results = {
      synced: {},
      errors: [],
      lastSyncedDate: new Date().toISOString(),
      rawZohoResponses: {}, // Store raw Zoho responses per module
    };

    Logger.info(`Starting historical sync`, {
      days,
      modules: modulesToSync,
    });

    // Sync each module sequentially
    for (const moduleName of modulesToSync) {
      try {
        const moduleResult = await this.syncModule(moduleName, days, userId);
        results.synced[moduleName] = moduleResult.synced;
        results.errors.push(...moduleResult.errors.map(e => ({
          ...e,
          module: moduleName,
        })));
        // Store raw Zoho responses for this module
        if (moduleResult.rawZohoResponses && moduleResult.rawZohoResponses.length > 0) {
          results.rawZohoResponses[moduleName] = moduleResult.rawZohoResponses;
        }
      } catch (error) {
        Logger.error(`Error syncing module ${moduleName}`, error);
        results.synced[moduleName] = 0;
        results.errors.push({
          module: moduleName,
          record: 'module',
          error: error.message,
        });
      }
    }

    const totalSynced = Object.values(results.synced).reduce((sum, count) => sum + count, 0);
    Logger.info(`Historical sync completed`, {
      totalSynced,
      errors: results.errors.length,
      modules: results.synced,
    });

    return results;
  }

  /**
   * Get latest sync dates for all modules (for UI display)
   * @returns {Promise<object>} Object with latest date per module
   */
  async getLatestSyncDates() {
    const dates = {};
    
    for (const module of this.modules) {
      const latestDate = await this.getLatestTransactionDate(module.name);
      dates[module.name] = latestDate;
    }
    
    return dates;
  }
}
