import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { Logger } from "@/libs/utils/logger";

/**
 * API route to toggle module bookmark status
 * 
 * POST /api/user/bookmark-module
 * Body: { moduleId: string, bookmarked: boolean }
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
    const { moduleId, bookmarked } = body;

    if (!moduleId || typeof bookmarked !== 'boolean') {
      return NextResponse.json(
        { error: "moduleId and bookmarked (boolean) are required" },
        { status: 400 }
      );
    }

    // Get current profile
    const profile = await dal.getSingle("profiles", { id: user.id });
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Get current settings or initialize
    const currentSettings = profile.settings || {};
    const currentBookmarks = currentSettings.dashboard_bookmarks || [];

    // Update bookmarks array
    let newBookmarks;
    if (bookmarked) {
      // Add bookmark if not already present
      newBookmarks = currentBookmarks.includes(moduleId)
        ? currentBookmarks
        : [...currentBookmarks, moduleId];
    } else {
      // Remove bookmark
      newBookmarks = currentBookmarks.filter(id => id !== moduleId);
    }

    // Update settings
    const updatedSettings = {
      ...currentSettings,
      dashboard_bookmarks: newBookmarks,
    };

    // Update profile
    const { error } = await dal.update(
      "profiles",
      { settings: updatedSettings },
      { id: user.id }
    );

    if (error) {
      Logger.error('[bookmark-module] Failed to update profile', error);
      return NextResponse.json(
        { error: "Failed to update bookmark" },
        { status: 500 }
      );
    }

    Logger.info('[bookmark-module] Bookmark updated', {
      userId: user.id,
      moduleId,
      bookmarked,
      totalBookmarks: newBookmarks.length,
    });

    return NextResponse.json({
      success: true,
      bookmarked,
      bookmarks: newBookmarks,
    });

  } catch (error) {
    Logger.error('[bookmark-module] Request error', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
