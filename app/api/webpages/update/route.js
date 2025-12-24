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
    Logger.info('[webpages/update] Request received', {
      url: req.url,
      method: req.method,
    });

    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });

    const user = await dal.getCurrentUser();
    Logger.info('[webpages/update] User check', {
      hasUser: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
    });

    if (!user) {
      Logger.warn('[webpages/update] Unauthorized - no user');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    Logger.info('[webpages/update] Request body - FULL PAYLOAD', {
      fullBody: body,
      webpageId: body.webpageId,
      hasHtmlContent: !!body.htmlContent,
      htmlContentLength: body.htmlContent?.length || 0,
      htmlContentPreview: body.htmlContent?.substring(0, 200) || null,
      name: body.name || null,
      urlKey: body.urlKey || null,
    });

    const { webpageId, htmlContent, name, urlKey } = body;

    if (!webpageId || !htmlContent) {
      return NextResponse.json(
        { error: "webpageId and htmlContent are required" },
        { status: 400 }
      );
    }

    // First, get the current webpage to check if url_key is being changed
    Logger.info('[webpages/update] Fetching current webpage', {
      webpageId,
      userId: user.id,
    });

    const { data: currentWebpage, error: getError } = await getWebpageById(webpageId, user.id);

    Logger.info('[webpages/update] getWebpageById result - FULL RESPONSE', {
      hasData: !!currentWebpage,
      hasError: !!getError,
      currentWebpageId: currentWebpage?.id || null,
      currentWebpageUrlKey: currentWebpage?.url_key || null,
      errorMessage: getError?.message || null,
      errorStack: getError?.stack || null,
      fullError: getError,
    });

    if (getError || !currentWebpage) {
      Logger.error('[webpages/update] Error fetching current webpage', getError, {
        webpageId,
        userId: user.id,
        hasError: !!getError,
        errorMessage: getError?.message || null,
        hasData: !!currentWebpage,
      });
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

    Logger.info('[webpages/update] Calling updateWebpage', {
      webpageId,
      userId: user.id,
      updates,
      updatesKeys: Object.keys(updates),
    });

    // Update webpage
    const { data, error } = await updateWebpage(webpageId, user.id, updates);

    Logger.info('[webpages/update] updateWebpage result', {
      hasData: !!data,
      hasError: !!error,
      dataId: data?.id || null,
      dataUrlKey: data?.url_key || null,
      errorMessage: error?.message || null,
      errorStack: error?.stack || null,
    });

    if (error) {
      Logger.error('[webpages/update] Error updating webpage', error, {
        webpageId,
        userId: user.id,
        updates,
      });
      
      // Check for unique constraint violation (safety net - should be caught by availability check)
      if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint') || error.code === '23505') {
        const errorResponse = {
          error: `URL key "${urlKey || currentWebpage.url_key}" is already taken by another page`,
        };
        Logger.info('[webpages/update] URL key conflict response', {
          fullResponse: errorResponse,
        });
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      const errorResponse = {
        error: error.message || "Failed to update webpage",
      };
      Logger.info('[webpages/update] Error response', {
        fullResponse: errorResponse,
      });
      return NextResponse.json(errorResponse, { status: 500 });
    }

    Logger.info('[webpages/update] Webpage updated successfully', {
      webpageId,
      userId: user.id,
      updatedWebpageId: data?.id || null,
      updatedUrlKey: data?.url_key || null,
    });

    const successResponse = {
      success: true,
      webpage: data,
    };

    Logger.info('[webpages/update] Success response - FULL RESPONSE', {
      fullResponse: successResponse,
      webpageId: successResponse.webpage?.id || null,
      webpageUrlKey: successResponse.webpage?.url_key || null,
      webpageName: successResponse.webpage?.name || null,
      hasHtmlContent: !!successResponse.webpage?.html_content,
      htmlContentLength: successResponse.webpage?.html_content?.length || 0,
    });

    return NextResponse.json(successResponse);

  } catch (error) {
    Logger.error('[webpages/update] Request error', error, {
      url: req.url,
      errorMessage: error.message,
      errorStack: error.stack,
    });
    const errorResponse = {
      error: error.message || "An error occurred",
    };
    Logger.info('[webpages/update] Exception response', {
      fullResponse: errorResponse,
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
