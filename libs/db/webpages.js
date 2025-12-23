/**
 * Database functions for webpages table
 * Uses DAL for RLS-compliant operations
 */

import { DataAccessLayer } from '@/libs/supabase/data-access-layer';
import { Logger } from '@/libs/utils/logger';

/**
 * Get all webpages for the current user
 */
export async function getUserWebpages(userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.select('webpages', {
      filters: { user_id: userId },
      orderBy: { column: 'updated_at', ascending: false },
    });

    if (error) {
      Logger.error('[webpages] Error fetching user webpages', error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    Logger.error('[webpages] Exception fetching user webpages', error);
    return { data: [], error };
  }
}

/**
 * Get a single webpage by ID
 */
export async function getWebpageById(webpageId, userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.getSingle('webpages', {
      id: webpageId,
      user_id: userId, // Ensure user can only access their own
    });

    if (error) {
      Logger.error('[webpages] Error fetching webpage', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    Logger.error('[webpages] Exception fetching webpage', error);
    return { data: null, error };
  }
}

/**
 * Create a new webpage
 */
export async function createWebpage(userId, webpageData) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: true, // Auto-inject user_id
    autoTimestamps: true,
  });

  try {
    const { data, error } = await dal.insert('webpages', {
      ...webpageData,
      user_id: userId, // Explicitly set for clarity
    });

    if (error) {
      Logger.error('[webpages] Error creating webpage', error);
      throw error;
    }

    Logger.info('[webpages] Webpage created', {
      webpageId: data?.[0]?.id,
      userId,
      name: webpageData.name,
    });

    return { data: data?.[0] || null, error: null };
  } catch (error) {
    Logger.error('[webpages] Exception creating webpage', error);
    return { data: null, error };
  }
}

/**
 * Update an existing webpage
 */
export async function updateWebpage(webpageId, userId, updates) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: true, // Auto-update updated_at
  });

  try {
    const { data, error } = await dal.update(
      'webpages',
      updates,
      {
        id: webpageId,
        user_id: userId, // Ensure user can only update their own
      }
    );

    if (error) {
      Logger.error('[webpages] Error updating webpage', error);
      throw error;
    }

    Logger.info('[webpages] Webpage updated', {
      webpageId,
      userId,
    });

    return { data: data?.[0] || null, error: null };
  } catch (error) {
    Logger.error('[webpages] Exception updating webpage', error);
    return { data: null, error };
  }
}

/**
 * Delete a webpage
 */
export async function deleteWebpage(webpageId, userId) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { error } = await dal.delete('webpages', {
      id: webpageId,
      user_id: userId, // Ensure user can only delete their own
    });

    if (error) {
      Logger.error('[webpages] Error deleting webpage', error);
      throw error;
    }

    Logger.info('[webpages] Webpage deleted', {
      webpageId,
      userId,
    });

    return { error: null };
  } catch (error) {
    Logger.error('[webpages] Exception deleting webpage', error);
    return { error };
  }
}

/**
 * Get a webpage by URL key for the current user
 */
export async function getWebpageByUrlKey(userId, urlKey) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const { data, error } = await dal.getSingle('webpages', {
      user_id: userId,
      url_key: urlKey,
    });

    if (error) {
      Logger.error('[webpages] Error fetching webpage by URL key', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    Logger.error('[webpages] Exception fetching webpage by URL key', error);
    return { data: null, error };
  }
}

/**
 * Check if url_key is available for user
 */
export async function isUrlKeyAvailable(userId, urlKey, excludeWebpageId = null) {
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });

  try {
    const filters = {
      user_id: userId,
      url_key: urlKey,
    };

    const { data, error } = await dal.select('webpages', {
      filters,
      single: true,
    });

    if (error && error.message?.includes('not found')) {
      // Not found means available
      return { available: true, error: null };
    }

    if (error) {
      throw error;
    }

    // If found and it's not the excluded ID, it's taken
    if (data && data.id !== excludeWebpageId) {
      return { available: false, error: null };
    }

    return { available: true, error: null };
  } catch (error) {
    Logger.error('[webpages] Exception checking url_key availability', error);
    return { available: false, error };
  }
}
