import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { updateWebpage, isUrlKeyAvailable, getWebpageById } from "@/libs/db/webpages";
import { Logger } from "@/libs/utils/logger";

/**
 * POST /api/webpages/update
 * Update an existing webpage
 * Body: { webpageId: string, htmlContent: string, name?: string, urlKey?: string }
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
    const { webpageId, htmlContent, name, urlKey } = body;

    if (!webpageId || !htmlContent) {
      return NextResponse.json(
        { error: "webpageId and htmlContent are required" },
        { status: 400 }
      );
    }

    // First, get the current webpage to check if url_key is being changed
    const { data: currentWebpage, error: getError } = await getWebpageById(webpageId, user.id);
    if (getError || !currentWebpage) {
      Logger.error('[webpages/update] Error fetching current webpage', getError);
      return NextResponse.json(
        { error: "Webpage not found" },
        { status: 404 }
      );
    }

    // Build updates object
    const updates = { html_content: htmlContent };
    if (name) updates.name = name;
    if (urlKey) {
      // Validate url_key format
      if (!/^[a-z0-9-]+$/.test(urlKey)) {
        return NextResponse.json(
          { error: "URL key can only contain lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      // Check if URL key is being changed
      if (urlKey !== currentWebpage.url_key) {
        // Check if the new URL key is available
        const { available, error: checkError } = await isUrlKeyAvailable(user.id, urlKey, webpageId);
        if (checkError) {
          Logger.error('[webpages/update] Error checking url_key', checkError);
          return NextResponse.json(
            { error: "Failed to validate URL key" },
            { status: 500 }
          );
        }

        if (!available) {
          return NextResponse.json(
            { error: `URL key "${urlKey}" is already taken by another page` },
            { status: 400 }
          );
        }
      }

      updates.url_key = urlKey;
    }

    // Update webpage
    const { data, error } = await updateWebpage(webpageId, user.id, updates);

    if (error) {
      Logger.error('[webpages/update] Error updating webpage', error);
      
      // Check for unique constraint violation (safety net - should be caught by availability check)
      if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint') || error.code === '23505') {
        return NextResponse.json(
          { error: `URL key "${urlKey || currentWebpage.url_key}" is already taken by another page` },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || "Failed to update webpage" },
        { status: 500 }
      );
    }

    Logger.info('[webpages/update] Webpage updated', {
      webpageId,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      webpage: data,
    });

  } catch (error) {
    Logger.error('[webpages/update] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
