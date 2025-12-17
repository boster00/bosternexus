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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:17',message:'getClient entry',data:{useServiceRole:this.useServiceRole},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (this.useServiceRole) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:19',message:'creating service role client',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const client = createServiceRoleClient();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:22',message:'service role client created',data:{hasClient:!!client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      return client;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:27',message:'creating regular client',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const client = await createClient();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:30',message:'regular client created',data:{hasClient:!!client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:203',message:'select entry',data:{tableName,useServiceRole:this.useServiceRole},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:206',message:'before getClient',data:{tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const supabase = await this.getClient();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:210',message:'getClient completed',data:{hasSupabase:!!supabase,tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:242',message:'before maybeSingle',data:{tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const result = await query.maybeSingle();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:245',message:'maybeSingle completed',data:{hasError:!!result.error,errorCode:result.error?.code,hasData:!!result.data,tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      if (result.error) {
        // PGRST116 is "not found" which is expected for maybeSingle
        if (result.error.code === 'PGRST116') {
          return { data: null, error: null };
        }
        if (result.error.code === '42501' || result.error.message?.includes('policy')) {
          throw new Error(`RLS policy violation on ${tableName}: ${result.error.message}`);
        }
        throw new Error(`Database select error on ${tableName}: ${result.error.message}`);
      }
      return { data: result.data, error: null };
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:257',message:'before query execution',data:{tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const { data, error } = await query;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/08ff2235-5c43-4d24-9fed-d67ac84833be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'data-access-layer.js:260',message:'query execution completed',data:{hasError:!!error,hasData:!!data,tableName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error(`RLS policy violation on ${tableName}: ${error.message}`);
      }
      throw new Error(`Database select error on ${tableName}: ${error.message}`);
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
