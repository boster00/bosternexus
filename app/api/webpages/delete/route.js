import { NextResponse } from "next/server";
import { deleteWebpage } from "@/libs/db/webpages";
import { Logger } from "@/libs/utils/logger";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * POST /api/webpages/delete
 * Delete a webpage
 * Body: { webpageId: string }
 */
export async function POST(req) {
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

    const body = await req.json();
    const { webpageId } = body;

    if (!webpageId) {
      return NextResponse.json(
        { error: "webpageId is required" },
        { status: 400 }
      );
    }

    // Delete webpage
    const { error } = await deleteWebpage(webpageId, user.id);

    if (error) {
      Logger.error('[webpages/delete] Error deleting webpage', error);
      return NextResponse.json(
        { error: error.message || "Failed to delete webpage" },
        { status: 500 }
      );
    }

    Logger.info('[webpages/delete] Webpage deleted', {
      webpageId,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    Logger.error('[webpages/delete] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
