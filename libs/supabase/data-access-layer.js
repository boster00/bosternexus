import { createClient, createServiceRoleClient } from './server';

/**
 * Data Access Layer - Safety wrapper around Supabase operations
 * Ensures RLS compliance, user_id injection, and common validations
 */
export class DataAccessLayer {
  constructor(options = {}) {
    this.useServiceRole = options.useServiceRole || false;
    this.requireUserId = options.requireUserId ?? true; // Default: require user_id
    this.autoTimestamps = options.autoTimestamps ?? true; // Default: auto-manage timestamps
  }

  /**
   * Get Supabase client (with or without service role)
   */
  async getClient() {
    if (this.useServiceRole) {
      const client = createServiceRoleClient();
      return client;
    }
    
    const client = await createClient();
    return client;
  }

  /**
   * Get current user ID from auth context
   */
  async getCurrentUserId() {
    if (this.useServiceRole) {
      return null; // Service role doesn't have user context
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }

  /**
   * Get current user object from auth context
   * Useful for layouts and components that need full user object
   */
  async getCurrentUser() {
    if (this.useServiceRole) {
      return null; // Service role doesn't have user context
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  }

  /**
   * Prepare record for insert/update
   * - Inject user_id if needed
   * - Manage timestamps
   * - Validate required fields
   */
  async prepareRecord(record, operation = 'upsert') {
    const prepared = { ...record };

    // Inject user_id if required and not provided
    if (this.requireUserId && !prepared.user_id && !this.useServiceRole) {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        throw new Error('user_id is required but no authenticated user found. Ensure user is logged in or use service role client.');
      }
      prepared.user_id = userId;
    }

    // Auto-manage timestamps
    if (this.autoTimestamps) {
      const now = new Date().toISOString();
      
      if (operation === 'insert' || operation === 'upsert') {
        // Only set created_at if record is new (no id or zoho_id exists)
        if (!prepared.id && !prepared.created_at) {
          prepared.created_at = now;
        }
      }
      
      // Always update updated_at on insert/update
      if (operation === 'insert' || operation === 'update' || operation === 'upsert') {
        prepared.updated_at = now;
      }
    }

    return prepared;
  }

  /**
   * Safe upsert with RLS compliance
   */
  async upsert(tableName, records, options = {}) {
    const supabase = await this.getClient();
    const conflictTarget = options.onConflict || 'id';
    
    // Handle single record or array
    const recordsArray = Array.isArray(records) ? records : [records];
    
    // Prepare all records
    const preparedRecords = await Promise.all(
      recordsArray.map(record => this.prepareRecord(record, 'upsert'))
    );

    // Validate user_id for RLS compliance
    if (this.requireUserId && !this.useServiceRole) {
      const currentUserId = await this.getCurrentUserId();
      for (const record of preparedRecords) {
        if (record.user_id !== currentUserId) {
          throw new Error(
            `RLS violation: record.user_id (${record.user_id}) does not match current user (${currentUserId}). ` +
            `This will fail RLS policies. Use service role client if this is intentional.`
          );
        }
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .upsert(preparedRecords, { onConflict: conflictTarget })
      .select();

    if (error) {
      // Enhanced error messages for RLS failures
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(
          `RLS policy violation on ${tableName}: ${error.message}. ` +
          `Ensure user_id matches authenticated user or use service role client.`
        );
      }
      throw new Error(`Database error on ${tableName}: ${error.message}`);
    }

    return { data, error: null };
  }

  /**
   * Safe insert with RLS compliance
   */
  async insert(tableName, records, options = {}) {
    const supabase = await this.getClient();
    const recordsArray = Array.isArray(records) ? records : [records];
    
    const preparedRecords = await Promise.all(
      recordsArray.map(record => this.prepareRecord(record, 'insert'))
    );

    // Validate user_id
    if (this.requireUserId && !this.useServiceRole) {
      const currentUserId = await this.getCurrentUserId();
      for (const record of preparedRecords) {
        if (record.user_id !== currentUserId) {
          throw new Error(
            `RLS violation: Cannot insert record with user_id ${record.user_id} as user ${currentUserId}`
          );
        }
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(preparedRecords)
      .select();

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(`RLS policy violation on ${tableName}: ${error.message}`);
      }
      throw new Error(`Database insert error on ${tableName}: ${error.message}`);
    }

    return { data, error: null };
  }

  /**
   * Safe update with RLS compliance
   * Supports queryBuilder for complex filter building
   */
  async update(tableName, updates, filters, options = {}) {
    const supabase = await this.getClient();
    
    const preparedUpdates = await this.prepareRecord(updates, 'update');

    // Remove user_id from updates (shouldn't change)
    delete preparedUpdates.user_id;

    let query = supabase.from(tableName).update(preparedUpdates);

    // If queryBuilder is provided, use it for custom query building
    if (options.queryBuilder && typeof options.queryBuilder === 'function') {
      query = options.queryBuilder(query);
    } else if (filters) {
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value === null) {
          query = query.is(key, null);
        } else {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query.select();

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(`RLS policy violation on ${tableName}: ${error.message}`);
      }
      throw new Error(`Database update error on ${tableName}: ${error.message}`);
    }

    return { data, error: null };
  }

  /**
   * Safe select with RLS compliance
   * Supports complex query building via queryBuilder function
   */
  async select(tableName, options = {}) {
    const supabase = await this.getClient();
    
    let query = supabase.from(tableName).select(options.columns || '*');

    // If queryBuilder is provided, use it for custom query building
    if (options.queryBuilder && typeof options.queryBuilder === 'function') {
      query = options.queryBuilder(query);
    } else {
      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (value === null) {
            query = query.is(key, null);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
    }

    // Support maybeSingle() for single record queries
    if (options.single) {
      const result = await query.maybeSingle();
      
      if (result.error) {
        // PGRST116 is "not found" which is expected for maybeSingle
        if (result.error.code === 'PGRST116') {
          return { data: null, error: null };
        }
        
        // Build detailed error information
        const errorDetails = {
          message: result.error.message,
          code: result.error.code,
          details: result.error.details,
          hint: result.error.hint,
          table: tableName,
        };

        // Log full error for debugging (use console.error as fallback if Logger not available)
        console.error(`[DAL] Database select error on ${tableName} (single):`, {
          error: result.error,
          errorDetails,
          table: tableName,
        });

        if (result.error.code === '42501' || result.error.message?.includes('policy')) {
          throw new Error(
            `RLS policy violation on ${tableName}: ${result.error.message}${result.error.details ? ` (Details: ${result.error.details})` : ''}${result.error.hint ? ` (Hint: ${result.error.hint})` : ''}`
          );
        }

        // Include all error details in the thrown error
        const errorMessage = `Database select error on ${tableName}: ${result.error.message || 'Unknown error'}`;
        const fullError = new Error(errorMessage);
        fullError.code = result.error.code;
        fullError.details = result.error.details;
        fullError.hint = result.error.hint;
        fullError.originalError = result.error;
        throw fullError;
      }
      return { data: result.data, error: null };
    }

    // #region agent log
    // Capture query details before execution
    const queryDetails = {
      tableName,
      hasQuery: !!query,
      queryType: typeof query,
      columns: options.columns,
    };
    
    // Try to extract URL and method from Supabase query if available
    try {
      if (query && typeof query === 'object') {
        // Supabase queries have internal properties we can inspect
        const queryKeys = Object.keys(query);
        queryDetails.queryKeys = queryKeys;
        
        // Try to get URL if available (Supabase stores this internally)
        if (query.url) {
          const urlString = query.url.toString();
          queryDetails.url = urlString;
          queryDetails.urlLength = urlString.length;
          queryDetails.urlTooLong = urlString.length > 2000; // Common URL length limit
          
          // Extract the query parameters part to see what's in the URL
          try {
            const urlObj = new URL(urlString);
            queryDetails.urlPath = urlObj.pathname;
            queryDetails.urlSearchParams = urlObj.search;
            queryDetails.urlSearchParamsLength = urlObj.search.length;
            
            // Count how many items are in .in() filters by parsing the search params
            const searchParams = urlObj.searchParams;
            for (const [key, value] of searchParams.entries()) {
              if (key.includes('in.') || value.includes('in.')) {
                // Try to count items in the in() filter
                const inMatch = value.match(/in\.\(([^)]+)\)/);
                if (inMatch) {
                  const items = inMatch[1].split(',');
                  queryDetails[`${key}_inCount`] = items.length;
                  queryDetails[`${key}_inSample`] = items.slice(0, 5);
                }
              }
            }
          } catch (urlParseError) {
            queryDetails.urlParseError = String(urlParseError);
          }
        }
        if (query.method) {
          queryDetails.method = query.method;
        }
        if (query.headers) {
          queryDetails.hasHeaders = true;
        }
        if (query.body) {
          queryDetails.hasBody = true;
          queryDetails.bodyType = typeof query.body;
          // Try to stringify body if it's an object
          try {
            queryDetails.bodyPreview = typeof query.body === 'string' 
              ? query.body.substring(0, 500) 
              : JSON.stringify(query.body).substring(0, 500);
          } catch (e) {
            queryDetails.bodyError = String(e);
          }
        }
      }
    } catch (e) {
      queryDetails.inspectionError = String(e);
    }
    
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:320',message:'Before query execution - detailed payload with URL length',data:queryDetails,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    const { data, error } = await query;
    
    // #region agent log
    // Capture detailed error information
    const errorDetails = {
      tableName,
      hasData: !!data,
      dataCount: data?.length || 0,
      hasError: !!error,
    };
    
    if (error) {
      errorDetails.errorMessage = error?.message;
      errorDetails.errorCode = error?.code;
      errorDetails.errorDetails = error?.details;
      errorDetails.errorHint = error?.hint;
      errorDetails.errorString = String(error);
      errorDetails.errorType = typeof error;
      errorDetails.errorConstructor = error?.constructor?.name;
      
      // Try to extract more error information
      try {
        errorDetails.errorKeys = Object.keys(error || {});
        errorDetails.errorJSON = JSON.stringify(error, Object.getOwnPropertyNames(error));
        
        // If error has a response property (HTTP error), capture it
        if (error.response) {
          errorDetails.hasResponse = true;
          errorDetails.responseStatus = error.response?.status;
          errorDetails.responseStatusText = error.response?.statusText;
          errorDetails.responseData = error.response?.data;
        }
        
        // If error has a request property (HTTP request), capture URL
        if (error.request) {
          errorDetails.hasRequest = true;
          if (error.request?.url) {
            errorDetails.requestUrl = error.request.url.toString();
          }
        }
      } catch (e) {
        errorDetails.errorInspectionError = String(e);
      }
    }
    
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:325',message:'After query execution - detailed error info',data:errorDetails,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (error) {
      // Log the raw error object with all its properties
      console.error(`[DAL] Database select error on ${tableName}:`, {
        error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorKeys: Object.keys(error || {}),
        errorString: String(error),
        errorJSON: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
        errorHint: error?.hint,
        table: tableName,
      });

      // Build detailed error message with all available error information
      const errorDetails = {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        table: tableName,
      };

      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(
          `RLS policy violation on ${tableName}: ${error.message}${error.details ? ` (Details: ${error.details})` : ''}${error.hint ? ` (Hint: ${error.hint})` : ''}`
        );
      }

      // Include all error details in the thrown error
      const errorMessage = `Database select error on ${tableName}: ${error.message || 'Unknown error'}`;
      const fullError = new Error(errorMessage);
      fullError.code = error.code;
      fullError.details = error.details;
      fullError.hint = error.hint;
      fullError.originalError = error;
      throw fullError;
    }

    return { data, error: null };
  }

  /**
   * Safe delete with RLS compliance
   */
  async delete(tableName, filters) {
    const supabase = await this.getClient();
    
    let query = supabase.from(tableName).delete();

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query.select();

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(`RLS policy violation on ${tableName}: ${error.message}`);
      }
      throw new Error(`Database delete error on ${tableName}: ${error.message}`);
    }

    return { data, error: null };
  }

  /**
   * Get single record by filters
   */
  async getSingle(tableName, filters) {
    const { data, error } = await this.select(tableName, { filters, limit: 1 });
    
    if (error) {
      throw error;
    }
    
    return data?.[0] || null;
  }
}
