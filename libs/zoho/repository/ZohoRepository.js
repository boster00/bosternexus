/**
 * ZohoRepository
 * 
 * Repository layer that provides caching for all Zoho entity fetches.
 * 
 * Principles:
 * 1. Always check DB first (fast, no API cost)
 * 2. Use Zoho API as backup if DB is empty
 * 3. Always update DB when Zoho is fetched (cache everything we pull)
 * 4. Handle deleted records with soft delete (status = 'deleted')
 * 
 * This layer wraps Zoho API calls and ensures all fetched data is cached in DB.
 * It can be used by orchestrator, services, or direct calls.
 */

import zoho from '@/libs/zoho';
import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';

export class ZohoRepository {
  constructor() {
    this.zoho = zoho;
    // Use DAL with service role for Zoho caching (system-level, not user-specific)
    this.dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // Zoho data is system-level
      autoTimestamps: true, // Auto-manage timestamps
    });
  }

  /**
   * Get a single record by ID with caching
   * 1. Check DB first
   * 2. If not found, fetch from Zoho
   * 3. Always cache the result in DB
   * 
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {string} zohoId - Zoho ID of the record
   * @param {string} userId - User ID (optional, for user-specific tokens)
   * @param {object} options - Options
   * @param {boolean} options.forceRefresh - Force refresh from Zoho even if in DB
   * @returns {Promise<object|null>} Record from DB or null if not found and Zoho returns nothing
   */
  async getById(EntityClass, zohoId, userId = null, options = {}) {
    const { forceRefresh = false } = options;
    const tableName = EntityClass.tableName;
    const zohoIdField = EntityClass.zohoIdField || 'zoho_id';

    // Step 1: Check DB first (unless force refresh)
    if (!forceRefresh) {
      try {
        const { data, error } = await this.dal.select(tableName, {
          queryBuilder: (query) => {
            return query
              .eq(zohoIdField, zohoId)
              .is('deleted_at', null) // Exclude soft-deleted records
              .limit(1);
          },
          single: true,
        });

        if (!error && data) {
          Logger.debug(`Cache hit for ${EntityClass.name}`, { zohoId, tableName });
          return data;
        }
      } catch (error) {
        Logger.warn(`Error checking DB cache for ${EntityClass.name}`, error, { zohoId, tableName });
        // Continue to Zoho fetch
      }
    }

    // Step 2: Fetch from Zoho (DB miss or force refresh)
    Logger.info(`Cache miss for ${EntityClass.name}, fetching from Zoho`, { zohoId, tableName, forceRefresh });
    
    try {
      const { service, apiEndpoint } = EntityClass;
      const endpoint = `${apiEndpoint}/${zohoId}`;
      
      // Fetch from Zoho API
      const zohoResponse = await this.zoho.get(service, endpoint, {}, userId);
      
      // Extract data using entity's extractFromResponse method
      const extracted = EntityClass.extractFromResponse 
        ? EntityClass.extractFromResponse(zohoResponse)
        : null;
      
      const zohoRecord = extracted && extracted.length > 0 ? extracted[0] : null;

      // Step 3: Handle Zoho response
      if (!zohoRecord) {
        // Record not found in Zoho - check if it exists in DB and mark as deleted
        if (!forceRefresh) {
          const { data: existingRecord } = await this.dal.select(tableName, {
            queryBuilder: (query) => {
              return query.eq(zohoIdField, zohoId).limit(1);
            },
            single: true,
          });

          if (existingRecord) {
            // Record exists in DB but not in Zoho - mark as deleted
            Logger.info(`Record ${zohoId} not found in Zoho, marking as deleted in DB`, {
              entity: EntityClass.name,
              zohoId,
              tableName,
            });
            
            await this.dal.update(tableName, { [zohoIdField]: zohoId }, {
              deleted_at: new Date().toISOString(),
              status: 'deleted', // If entity has status field
            });
          }
        }
        
        return null;
      }

      // Step 4: Transform and cache in DB
      const dbRecord = EntityClass.transformToDbRecord(zohoRecord);
      
      // Ensure deleted_at is null for active records
      if (dbRecord.deleted_at) {
        delete dbRecord.deleted_at;
      }
      if (dbRecord.status === 'deleted') {
        dbRecord.status = null; // Clear deleted status if entity has status field
      }

      // Upsert to DB (cache the result)
      const { data: cachedRecord, error: upsertError } = await this.dal.upsert(
        tableName,
        [dbRecord],
        { onConflict: zohoIdField }
      );

      if (upsertError) {
        Logger.error(`Error caching ${EntityClass.name} record`, upsertError, {
          zohoId,
          tableName,
        });
        // Return the transformed record even if caching failed
        return dbRecord;
      }

      Logger.debug(`Cached ${EntityClass.name} record`, { zohoId, tableName });
      return cachedRecord && cachedRecord[0] ? cachedRecord[0] : dbRecord;

    } catch (error) {
      Logger.error(`Error fetching ${EntityClass.name} from Zoho`, error, {
        zohoId,
        tableName,
      });
      
      // If Zoho returns 404 or "not found", check DB and mark as deleted
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        const { data: existingRecord } = await this.dal.select(tableName, {
          queryBuilder: (query) => {
            return query.eq(zohoIdField, zohoId).limit(1);
          },
          single: true,
        });

        if (existingRecord) {
          Logger.info(`Record ${zohoId} not found in Zoho (404), marking as deleted in DB`, {
            entity: EntityClass.name,
            zohoId,
            tableName,
          });
          
          await this.dal.update(tableName, { [zohoIdField]: zohoId }, {
            deleted_at: new Date().toISOString(),
            status: 'deleted',
          });
        }
      }
      
      throw error;
    }
  }

  /**
   * Get multiple records by IDs with caching
   * Fetches from DB first, then Zoho for missing ones, caches all results
   * 
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {Array<string>} zohoIds - Array of Zoho IDs
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Array>} Array of records (from DB or Zoho)
   */
  async getByIds(EntityClass, zohoIds, userId = null) {
    if (!zohoIds || zohoIds.length === 0) {
      return [];
    }

    const tableName = EntityClass.tableName;
    const zohoIdField = EntityClass.zohoIdField || 'zoho_id';
    const results = [];
    const missingIds = [];

    // Step 1: Fetch from DB
    try {
      const { data: dbRecords, error } = await this.dal.select(tableName, {
        queryBuilder: (query) => {
          return query
            .in(zohoIdField, zohoIds)
            .is('deleted_at', null); // Exclude soft-deleted records
        },
      });

      if (!error && dbRecords) {
        const foundIds = new Set(dbRecords.map(r => r[zohoIdField]));
        missingIds.push(...zohoIds.filter(id => !foundIds.has(id)));
        results.push(...dbRecords);
      } else {
        missingIds.push(...zohoIds);
      }
    } catch (error) {
      Logger.warn(`Error fetching from DB cache`, error, { tableName, zohoIds });
      missingIds.push(...zohoIds);
    }

    // Step 2: Fetch missing records from Zoho and cache them
    if (missingIds.length > 0) {
      Logger.info(`Fetching ${missingIds.length} missing records from Zoho`, {
        entity: EntityClass.name,
        tableName,
        missingCount: missingIds.length,
      });

      // Fetch from Zoho one by one (respecting rate limits)
      // Note: Could be optimized to batch if Zoho API supports it
      for (const zohoId of missingIds) {
        try {
          const record = await this.getById(EntityClass, zohoId, userId, { forceRefresh: false });
          if (record) {
            results.push(record);
          }
        } catch (error) {
          Logger.error(`Error fetching ${zohoId} from Zoho`, error, {
            entity: EntityClass.name,
            zohoId,
          });
          // Continue with other IDs
        }
      }
    }

    return results;
  }

  /**
   * List records with caching
   * This is more complex - we cache individual records but not the list itself
   * Use this for initial syncs, then use getById/getByIds for lookups
   * 
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {object} params - Query parameters
   * @param {string} userId - User ID (optional)
   * @param {boolean} cacheResults - Whether to cache fetched records (default: true)
   * @returns {Promise<Array>} Array of records
   */
  async list(EntityClass, params = {}, userId = null, cacheResults = true) {
    const { service, apiEndpoint } = EntityClass;
    
    // Fetch from Zoho
    const zohoResponse = await this.zoho.get(service, apiEndpoint, params, userId);
    
    // Extract data using entity's extractFromResponse
    const extracted = EntityClass.extractFromResponse 
      ? EntityClass.extractFromResponse(zohoResponse)
      : (zohoResponse.data || []);
    
    if (!Array.isArray(extracted) || extracted.length === 0) {
      return [];
    }

    // Cache all fetched records if requested
    if (cacheResults) {
      const tableName = EntityClass.tableName;
      const zohoIdField = EntityClass.zohoIdField || 'zoho_id';
      
      const dbRecords = extracted
        .map(zohoRecord => {
          try {
            return EntityClass.transformToDbRecord(zohoRecord);
          } catch (error) {
            Logger.error(`Error transforming record for caching`, error, {
              entity: EntityClass.name,
              zohoId: zohoRecord[zohoIdField] || 'unknown',
            });
            return null;
          }
        })
        .filter(record => record !== null);

      if (dbRecords.length > 0) {
        try {
          await this.dal.upsert(tableName, dbRecords, { onConflict: zohoIdField });
          Logger.debug(`Cached ${dbRecords.length} records from list`, {
            entity: EntityClass.name,
            tableName,
            count: dbRecords.length,
          });
        } catch (error) {
          Logger.error(`Error caching list results`, error, {
            entity: EntityClass.name,
            tableName,
            count: dbRecords.length,
          });
          // Continue - return results even if caching failed
        }
      }
    }

    return extracted;
  }

  /**
   * Search records with caching
   * Similar to list, but with search criteria
   * 
   * @param {EntityClass} EntityClass - Entity definition class
   * @param {string} criteria - Search criteria string
   * @param {object} params - Additional query parameters
   * @param {string} userId - User ID (optional)
   * @param {boolean} cacheResults - Whether to cache fetched records (default: true)
   * @returns {Promise<Array>} Array of records
   */
  async search(EntityClass, criteria, params = {}, userId = null, cacheResults = true) {
    const { service, apiEndpoint } = EntityClass;
    
    // Build search params
    const searchParams = {
      ...params,
      criteria: criteria,
    };

    // Fetch from Zoho
    const zohoResponse = await this.zoho.get(service, apiEndpoint, searchParams, userId);
    
    // Extract and cache (same logic as list)
    const extracted = EntityClass.extractFromResponse 
      ? EntityClass.extractFromResponse(zohoResponse)
      : (zohoResponse.data || []);

    if (!Array.isArray(extracted) || extracted.length === 0) {
      return [];
    }

    // Cache results if requested
    if (cacheResults) {
      const tableName = EntityClass.tableName;
      const zohoIdField = EntityClass.zohoIdField || 'zoho_id';
      
      const dbRecords = extracted
        .map(zohoRecord => {
          try {
            return EntityClass.transformToDbRecord(zohoRecord);
          } catch (error) {
            Logger.error(`Error transforming search result for caching`, error, {
              entity: EntityClass.name,
            });
            return null;
          }
        })
        .filter(record => record !== null);

      if (dbRecords.length > 0) {
        try {
          await this.dal.upsert(tableName, dbRecords, { onConflict: zohoIdField });
        } catch (error) {
          Logger.error(`Error caching search results`, error, {
            entity: EntityClass.name,
            tableName,
          });
        }
      }
    }

    return extracted;
  }
}
