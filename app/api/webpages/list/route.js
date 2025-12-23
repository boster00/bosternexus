import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { getUserWebpages } from "@/libs/db/webpages";
import { Logger } from "@/libs/utils/logger";

/**
 * GET /api/webpages/list
 * Get all webpages for the current user
 */
export async function GET(req) {
  try {
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });

    const user = await dal.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await getUserWebpages(user.id);

    if (error) {
      Logger.error('[webpages/list] Error fetching webpages', error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch webpages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      webpages: data,
    });

  } catch (error) {
    Logger.error('[webpages/list] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
