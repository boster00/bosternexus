import { NextResponse } from "next/server";
import { ZohoOrchestrator } from "@/libs/zoho/orchestration/ZohoOrchestrator";
import { BooksItemEntity } from "@/libs/zoho/entities";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * API route for syncing Zoho Books items
 * GET: Get sync status/info
 * POST: Sync items from Zoho Books to database
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { per_page = 5, page = 1 } = body;

    // Get current user for user-specific tokens using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Create orchestrator instance
    const orchestrator = new ZohoOrchestrator();

    // Sync items: list → transform → upsert
    const result = await orchestrator.sync(BooksItemEntity, {
      per_page: parseInt(per_page) || 5,
      page: parseInt(page) || 1,
    }, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.summary,
        data: {
          synced: result.synced,
          total: result.total,
          transformed: result.transformed,
          errors: result.errors,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.summary,
          data: {
            synced: result.synced,
            total: result.total,
            transformed: result.transformed,
            errors: result.errors,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error syncing Zoho Books items:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while syncing items",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Get sync status and statistics
 */
export async function GET(req) {
  try {
    // Use DAL with service role for system-level data (Zoho syncs)
    const dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // Zoho data is system-level
      autoTimestamps: false, // Don't auto-manage timestamps for reads
    });

    // Get total count of synced items
    // Note: DAL doesn't support count queries yet, so we'll get all and count
    // For better performance, you might want to add a count method to DAL
    const { data: allItems } = await dal.select(BooksItemEntity.tableName, {
      columns: "id", // Only select id for counting
    });

    const count = allItems?.length || 0;

    // Get last sync time
    const lastSyncResult = await dal.select(BooksItemEntity.tableName, {
      columns: "synced_at",
      orderBy: { column: "synced_at", ascending: false },
      limit: 1,
      single: true,
    });

    const lastSync = lastSyncResult.data;

    return NextResponse.json({
      success: true,
      data: {
        totalItems: count || 0,
        lastSyncedAt: lastSync?.synced_at || null,
        tableName: BooksItemEntity.tableName,
      },
    });
  } catch (error) {
    console.error("Error getting sync status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}
