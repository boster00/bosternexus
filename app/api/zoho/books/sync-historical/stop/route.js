import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { syncStopManager } from "@/libs/zoho/services/books/SyncStopManager";
import { Logger } from "@/libs/utils/logger";

/**
 * POST endpoint to stop active sync operations
 * 
 * POST /api/zoho/books/sync-historical/stop
 */
export async function POST(req) {
  try {
    // Get current user using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Request stop for this user's sync
    const stopped = syncStopManager.requestStop(userId);

    if (!stopped) {
      return NextResponse.json({
        success: false,
        message: 'No active sync found to stop',
      }, { status: 404 });
    }

    Logger.info('Sync stop requested', { userId });

    return NextResponse.json({
      success: true,
      message: 'Stop request sent. Sync will stop at the next checkpoint.',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    Logger.error('Error requesting sync stop', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while requesting stop',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check sync status
 * 
 * GET /api/zoho/books/sync-historical/stop
 */
export async function GET(req) {
  try {
    // Get current user using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    const status = syncStopManager.getSyncStatus(userId);

    return NextResponse.json({
      success: true,
      active: status !== null,
      status: status,
    });

  } catch (error) {
    Logger.error('Error getting sync status', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred',
      },
      { status: 500 }
    );
  }
}
