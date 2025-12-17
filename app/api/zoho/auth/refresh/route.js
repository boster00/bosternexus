import { NextResponse } from "next/server";
import zoho from "@/libs/zoho";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * API route for refreshing Zoho access token
 * Uses the refresh token to get a new access token via the service method
 * 
 * POST /api/zoho/auth/refresh
 * Body: { service: string }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { service } = body;

    if (!service) {
      return NextResponse.json(
        { error: "service is required" },
        { status: 400 }
      );
    }

    // Validate service
    const validServices = ["books", "crm", "desk"];
    if (!validServices.includes(service)) {
      return NextResponse.json(
        { error: `Invalid service. Must be one of: ${validServices.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current user for user-specific tokens using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Use the service method to refresh the token
    // This will use the refresh token to get a new access token
    const newAccessToken = await zoho.refreshAccessToken(service, userId);

    if (!newAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to refresh token. No refresh token available or refresh failed.",
        },
        { status: 400 }
      );
    }

    // Get updated token details after refresh
    const tokenDetails = await zoho.authService.getToken(service, userId);

    return NextResponse.json({
      success: true,
      message: `Token refreshed successfully for Zoho ${service}`,
      tokenDetails: tokenDetails ? {
        accessToken: tokenDetails.accessToken,
        refreshToken: tokenDetails.refreshToken,
        expiresAt: tokenDetails.expiresAt ? tokenDetails.expiresAt.toISOString() : null,
        metadata: tokenDetails.metadata || {},
      } : null,
    });
  } catch (error) {
    console.error("Error refreshing Zoho token:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while refreshing the token",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
