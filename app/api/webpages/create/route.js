import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { createWebpage, isUrlKeyAvailable } from "@/libs/db/webpages";
import { Logger } from "@/libs/utils/logger";

/**
 * POST /api/webpages/create
 * Create a new webpage
 * Body: { name: string, urlKey: string, htmlContent: string }
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
    const { name, urlKey, htmlContent } = body;

    if (!name || !urlKey || !htmlContent) {
      return NextResponse.json(
        { error: "name, urlKey, and htmlContent are required" },
        { status: 400 }
      );
    }

    // Validate url_key format
    if (!/^[a-z0-9-]+$/.test(urlKey)) {
      return NextResponse.json(
        { error: "URL key can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check if url_key is available
    const { available, error: checkError } = await isUrlKeyAvailable(user.id, urlKey);
    if (checkError) {
      Logger.error('[webpages/create] Error checking url_key', checkError);
      return NextResponse.json(
        { error: "Failed to validate URL key" },
        { status: 500 }
      );
    }

    if (!available) {
      return NextResponse.json(
        { error: `URL key "${urlKey}" is already taken` },
        { status: 400 }
      );
    }

    // Create webpage
    const { data, error } = await createWebpage(user.id, {
      name,
      url_key: urlKey,
      html_content: htmlContent,
    });

    if (error) {
      Logger.error('[webpages/create] Error creating webpage', error);
      
      // Check for unique constraint violation (safety net - should be caught by availability check)
      if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint') || error.code === '23505') {
        return NextResponse.json(
          { error: `URL key "${urlKey}" is already taken` },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || "Failed to create webpage" },
        { status: 500 }
      );
    }

    Logger.info('[webpages/create] Webpage created', {
      webpageId: data?.id,
      userId: user.id,
      name,
      urlKey,
    });

    return NextResponse.json({
      success: true,
      webpage: data,
    });

  } catch (error) {
    Logger.error('[webpages/create] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
