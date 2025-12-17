import { NextResponse } from "next/server";
import { getAuthUrl, getRedirectUri } from "@/libs/zoho/config";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import crypto from "crypto";

/**
 * Initiate OAuth authorization flow for Zoho
 * GET /api/zoho/auth/authorize?service=books|crm|desk
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");

    if (!service) {
      return NextResponse.json(
        { error: "service parameter is required (books, crm, or desk)" },
        { status: 400 }
      );
    }

    const validServices = ["books", "crm", "desk"];
    if (!validServices.includes(service)) {
      return NextResponse.json(
        { error: `Invalid service. Must be one of: ${validServices.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current user (optional - for user-specific tokens) using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString("hex");

    // Store state in session/cookie (simplified - in production, use secure session storage)
    // For now, we'll include user info in state if authenticated
    const stateData = {
      state,
      service,
      userId: userId || null,
      timestamp: Date.now(),
    };

    // Get base URL from request
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    // Build redirect URI (single callback URL for all services)
    const redirectUri = getRedirectUri(baseUrl);

    // Build authorization URL
    const authUrl = getAuthUrl(service, redirectUri, state);

    // Store state temporarily (in production, use secure session storage)
    // For now, encode state data in a cookie
    const response = NextResponse.redirect(authUrl);
    response.cookies.set(`zoho_oauth_state_${service}`, JSON.stringify(stateData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("OAuth authorization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}
