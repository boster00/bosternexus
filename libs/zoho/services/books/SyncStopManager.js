/**
 * SyncStopManager
 * 
 * Manages stop flags for active sync operations.
 * Uses in-memory storage to track stop requests per user.
 * 
 * Note: In serverless environments, this only works within the same function instance.
 * For production, consider using Redis or a database table for cross-instance coordination.
 */

class SyncStopManager {
  constructor() {
    // Map of userId -> stop flag
    // Format: { userId: { stopped: boolean, timestamp: Date } }
    this.stopFlags = new Map();
    
    // Map of userId -> sync metadata
    // Format: { userId: { module: string, page: number, record: number } }
    this.activeSyncs = new Map();
  }

  /**
   * Register an active sync for a user
   * @param {string} userId - User ID
   * @param {string} moduleName - Module being synced
   */
  registerSync(userId, moduleName) {
    const key = userId || 'system';
    this.activeSyncs.set(key, {
      module: moduleName,
      startedAt: new Date(),
    });
    
    // Clear any existing stop flag when starting a new sync
    this.stopFlags.delete(key);
  }

  /**
   * Update sync progress
   * @param {string} userId - User ID
   * @param {string} moduleName - Module being synced
   * @param {number} page - Current page number
   * @param {number} record - Current record index in batch
   */
  updateProgress(userId, moduleName, page, record) {
    const key = userId || 'system';
    this.activeSyncs.set(key, {
      module: moduleName,
      page,
      record,
      startedAt: this.activeSyncs.get(key)?.startedAt || new Date(),
      lastUpdate: new Date(),
    });
  }

  /**
   * Unregister a sync (when completed or stopped)
   * @param {string} userId - User ID
   */
  unregisterSync(userId) {
    const key = userId || 'system';
    this.activeSyncs.delete(key);
    this.stopFlags.delete(key);
  }

  /**
   * Request stop for a user's sync
   * @param {string} userId - User ID
   * @returns {boolean} True if stop was requested, false if no active sync
   */
  requestStop(userId) {
    const key = userId || 'system';
    
    if (!this.activeSyncs.has(key)) {
      return false; // No active sync to stop
    }

    this.stopFlags.set(key, {
      stopped: true,
      timestamp: new Date(),
    });

    return true;
  }

  /**
   * Check if stop has been requested for a user's sync
   * @param {string} userId - User ID
   * @returns {boolean} True if stop was requested
   */
  isStopRequested(userId) {
    const key = userId || 'system';
    const flag = this.stopFlags.get(key);
    return flag ? flag.stopped : false;
  }

  /**
   * Get active sync status for a user
   * @param {string} userId - User ID
   * @returns {object|null} Sync status or null if no active sync
   */
  getSyncStatus(userId) {
    const key = userId || 'system';
    const sync = this.activeSyncs.get(key);
    const stopFlag = this.stopFlags.get(key);

    if (!sync) {
      return null;
    }

    return {
      ...sync,
      stopped: stopFlag ? stopFlag.stopped : false,
      stopRequestedAt: stopFlag ? stopFlag.timestamp : null,
    };
  }

  /**
   * Get all active syncs (for admin/debugging)
   * @returns {Array} Array of active sync statuses
   */
  getAllActiveSyncs() {
    const result = [];
    for (const [userId, sync] of this.activeSyncs.entries()) {
      const stopFlag = this.stopFlags.get(userId);
      result.push({
        userId,
        ...sync,
        stopped: stopFlag ? stopFlag.stopped : false,
        stopRequestedAt: stopFlag ? stopFlag.timestamp : null,
      });
    }
    return result;
  }

  /**
   * Clear all syncs (for cleanup/testing)
   */
  clearAll() {
    this.stopFlags.clear();
    this.activeSyncs.clear();
  }
}

// Export singleton instance
export const syncStopManager = new SyncStopManager();
