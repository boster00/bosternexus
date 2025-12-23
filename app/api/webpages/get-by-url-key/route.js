import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { getWebpageByUrlKey } from "@/libs/db/webpages";
import { Logger } from "@/libs/utils/logger";

/**
 * GET /api/webpages/get-by-url-key?url_key=...
 * Get a webpage by URL key for the current user
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const urlKey = searchParams.get('url_key');

    if (!urlKey) {
      return NextResponse.json(
        { error: "url_key parameter is required" },
        { status: 400 }
      );
    }

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

    const { data, error } = await getWebpageByUrlKey(user.id, urlKey);

    if (error) {
      Logger.error('[webpages/get-by-url-key] Error fetching webpage', error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch webpage" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Webpage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      webpage: data,
    });

  } catch (error) {
    Logger.error('[webpages/get-by-url-key] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
