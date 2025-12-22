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

    // Check if settings column exists (it might not if migration hasn't been run)
    // If settings doesn't exist, initialize it
    let currentSettings = {};
    if (profile.settings !== undefined && profile.settings !== null) {
      if (typeof profile.settings === 'object') {
        currentSettings = profile.settings;
      } else {
        // If settings is a string, try to parse it
        try {
          currentSettings = typeof profile.settings === 'string' 
            ? JSON.parse(profile.settings) 
            : {};
        } catch {
          currentSettings = {};
        }
      }
    }
    
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
    try {
      const { error } = await dal.update(
        "profiles",
        { settings: updatedSettings },
        { id: user.id }
      );

      if (error) {
        Logger.error('[bookmark-module] Failed to update profile', {
          error,
          errorMessage: error.message,
          errorCode: error.code,
        });
        
        // Check if the error is about missing column
        if (error.message?.includes("settings") && error.message?.includes("column")) {
          return NextResponse.json(
            { 
              error: "Database migration required. Please run migration 015_add_settings_to_profiles.sql in Supabase.",
              details: "The 'settings' column does not exist in the profiles table. Run the migration to add it."
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { error: error.message || "Failed to update bookmark" },
          { status: 500 }
        );
      }
    } catch (updateError) {
      Logger.error('[bookmark-module] Update exception', {
        error: updateError,
        errorMessage: updateError.message,
        errorStack: updateError.stack,
      });
      
      // Check if the error is about missing column
      if (updateError.message?.includes("settings") && updateError.message?.includes("column")) {
        return NextResponse.json(
          { 
            error: "Database migration required. Please run migration 015_add_settings_to_profiles.sql in Supabase.",
            details: "The 'settings' column does not exist in the profiles table. Run the migration to add it."
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: updateError.message || "Failed to update bookmark" },
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
