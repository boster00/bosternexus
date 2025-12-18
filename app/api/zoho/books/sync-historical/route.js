import { NextResponse } from "next/server";
import { BooksHistoricalSyncService } from "@/libs/zoho/services/books/BooksHistoricalSyncService";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * API route for syncing historical Zoho Books transaction data
 * 
 * POST /api/zoho/books/sync-historical
 * Body: { days?: number, modules?: string[] }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { days = 180, modules = null } = body;

    // Get current user for user-specific tokens using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Validate days parameter
    if (typeof days !== 'number' || days < 1) {
      return NextResponse.json(
        { error: "days must be a positive number" },
        { status: 400 }
      );
    }

    // Validate modules if provided
    const validModules = ['salesorders', 'invoices', 'purchaseorders', 'bills'];
    if (modules && Array.isArray(modules)) {
      const invalidModules = modules.filter(m => !validModules.includes(m));
      if (invalidModules.length > 0) {
        return NextResponse.json(
          { error: `Invalid modules: ${invalidModules.join(', ')}. Valid modules: ${validModules.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Create sync service
    const syncService = new BooksHistoricalSyncService();

    // Start sync (this may take a while, but we'll return partial results on timeout)
    const result = await syncService.syncRecentTransactions(days, modules, userId);

    return NextResponse.json({
      success: result.errors.length === 0,
      synced: result.synced,
      errors: result.errors,
      lastSyncedDate: result.lastSyncedDate,
      rawZohoResponses: result.rawZohoResponses || {}, // Include raw Zoho JSON responses
      stopped: result.stopped || false, // Include stop status
      summary: result.stopped 
        ? `Sync stopped. Synced ${Object.values(result.synced).reduce((sum, count) => sum + count, 0)} total records across ${Object.keys(result.synced).length} modules before stopping.`
        : `Synced ${Object.values(result.synced).reduce((sum, count) => sum + count, 0)} total records across ${Object.keys(result.synced).length} modules`,
    });
  } catch (error) {
    console.error("Error syncing historical transactions:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred during sync",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve latest sync dates for UI display
 * 
 * GET /api/zoho/books/sync-historical
 */
export async function GET(req) {
  try {
    const syncService = new BooksHistoricalSyncService();
    const latestDates = await syncService.getLatestSyncDates();

    // Format dates for display
    // All dates are in UTC, calculate differences correctly
    const formattedDates = {};
    const now = new Date(); // Current time in UTC (JavaScript Date is always UTC internally)
    
    for (const [module, date] of Object.entries(latestDates)) {
      if (date) {
        // Both dates are in UTC, so the difference calculation is correct
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        let timeAgo = '';
        if (diffDays > 0) {
          timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
          timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else if (diffSeconds > 0) {
          timeAgo = `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
        } else {
          timeAgo = 'Just now';
        }

        formattedDates[module] = {
          date: date.toISOString(),
          timeAgo,
          formatted: date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }), // PST/PDT
        };
      } else {
        formattedDates[module] = null;
      }
    }

    return NextResponse.json({
      success: true,
      latestDates: formattedDates,
    });
  } catch (error) {
    console.error("Error getting latest sync dates:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}
