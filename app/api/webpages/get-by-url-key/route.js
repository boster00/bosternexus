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

    Logger.info('[webpages/get-by-url-key] Request received', {
      urlKey,
      url: req.url,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    if (!urlKey) {
      Logger.warn('[webpages/get-by-url-key] Missing url_key parameter');
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
    Logger.info('[webpages/get-by-url-key] User check', {
      hasUser: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
    });

    if (!user) {
      Logger.warn('[webpages/get-by-url-key] Unauthorized - no user');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    Logger.info('[webpages/get-by-url-key] Calling getWebpageByUrlKey', {
      userId: user.id,
      urlKey,
    });

    const { data, error } = await getWebpageByUrlKey(user.id, urlKey);

    Logger.info('[webpages/get-by-url-key] getWebpageByUrlKey result', {
      hasData: !!data,
      hasError: !!error,
      dataId: data?.id || null,
      dataUrlKey: data?.url_key || null,
      errorMessage: error?.message || null,
      errorStack: error?.stack || null,
    });

    if (error) {
      Logger.error('[webpages/get-by-url-key] Error fetching webpage', error, {
        userId: user.id,
        urlKey,
      });
      return NextResponse.json(
        { error: error.message || "Failed to fetch webpage" },
        { status: 500 }
      );
    }

    if (!data) {
      Logger.info('[webpages/get-by-url-key] Webpage not found (404)', {
        userId: user.id,
        urlKey,
        note: 'This is expected for new pages',
      });
      return NextResponse.json(
        { error: "Webpage not found" },
        { status: 404 }
      );
    }

    Logger.info('[webpages/get-by-url-key] Success', {
      webpageId: data.id,
      urlKey: data.url_key,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      webpage: data,
    });

  } catch (error) {
    Logger.error('[webpages/get-by-url-key] Request error', error, {
      url: req.url,
      errorMessage: error.message,
      errorStack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
