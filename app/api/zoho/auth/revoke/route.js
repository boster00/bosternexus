import { NextResponse } from "next/server";
import { ZohoAuthService } from "@/libs/zoho/auth";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * Revoke OAuth tokens for a Zoho service
 * POST /api/zoho/auth/revoke
 * Body: { service: 'books'|'crm'|'desk' }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { service } = body;

    if (!service) {
      return NextResponse.json(
        { error: "service is required (books, crm, or desk)" },
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

    // Get current user using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    // Revoke tokens
    const authService = new ZohoAuthService();
    await authService.revokeToken(service, userId);

    return NextResponse.json({
      success: true,
      message: `Tokens revoked for Zoho ${service}`,
    });
  } catch (error) {
    console.error("Token revocation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to revoke tokens" },
      { status: 500 }
    );
  }
}
