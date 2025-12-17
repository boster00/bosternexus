import { NextResponse } from "next/server";
import { ZohoAuthService } from "@/libs/zoho/auth";
import { getRedirectUri } from "@/libs/zoho/config";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

// Ensure this route is dynamic (not statically generated)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handle OAuth callback from Zoho
 * GET /api/zoho/auth/callback?code=...&state=...
 * 
 * Note: Zoho OAuth uses a single callback URL for all services.
 * The service is determined from the state cookie.
 */
export async function GET(req) {
  // Get base URL from request first (needed for absolute redirects)
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host");
  const baseUrl = `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const location = searchParams.get("location"); // Zoho may include location parameter
    const accountsServer = searchParams.get("accounts-server"); // Zoho may include accounts-server parameter

    console.log("Zoho OAuth callback received:", { 
      code: code ? code.substring(0, 20) + "..." : null, 
      state: state ? state.substring(0, 20) + "..." : null, 
      error, 
      location,
      url: req.url 
    });

    // Helper function to create absolute redirect URL
    const getRedirectUrl = (path) => {
      return `${baseUrl}${path}`;
    };

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error from Zoho:", error);
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent(error)}`)
      );
    }

    if (!code || !state) {
      console.error("Missing required parameters:", { hasCode: !!code, hasState: !!state });
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("Missing required parameters: code or state")}`)
      );
    }

    // Find state cookie - check all possible service cookies
    // Since we don't know which service initiated the flow, we need to check all
    let stateCookie = null;
    let service = null;
    const services = ["books", "crm", "desk"];
    
    // Get all cookies for debugging
    const allCookies = req.cookies.getAll();
    console.log("Available cookies:", allCookies.map(c => c.name).filter(n => n.startsWith("zoho_oauth_state_")));
    
    for (const svc of services) {
      const cookie = req.cookies.get(`zoho_oauth_state_${svc}`);
      if (cookie) {
        try {
          const data = JSON.parse(cookie.value);
          console.log(`Checking cookie for ${svc}:`, { storedState: data.state?.substring(0, 20) + "...", receivedState: state?.substring(0, 20) + "..." });
          if (data.state === state) {
            stateCookie = cookie;
            service = svc;
            console.log(`Found matching state cookie for service: ${svc}`);
            break;
          }
        } catch (e) {
          console.error(`Error parsing cookie for ${svc}:`, e);
          // Continue checking other cookies
        }
      }
    }

    if (!stateCookie || !service) {
      console.error("State verification failed - no matching cookie found", {
        receivedState: state?.substring(0, 20) + "...",
        checkedServices: services,
      });
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("State verification failed - cookie not found. Please try authorizing again.")}`)
      );
    }

    let stateData;
    try {
      stateData = JSON.parse(stateCookie.value);
    } catch (e) {
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("Invalid state data")}`)
      );
    }

    if (stateData.state !== state) {
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("State mismatch")}`)
      );
    }

    // Check if state is expired (10 minutes)
    if (Date.now() - stateData.timestamp > 600000) {
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("State expired")}`)
      );
    }

    // Verify service matches
    if (stateData.service !== service) {
      return NextResponse.redirect(
        getRedirectUrl(`/zoho-test?error=${encodeURIComponent("Service mismatch")}`)
      );
    }

    // Get current user using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const currentUserId = await dal.getCurrentUserId();

    // Use userId from state or current user
    const userId = stateData.userId || currentUserId || null;

    // Build redirect URI (must match the one used in authorization - single callback URL)
    const redirectUri = getRedirectUri(baseUrl);

    // Exchange code for tokens
    console.log(`Exchanging code for tokens for service: ${service}`);
    const authService = new ZohoAuthService();
    await authService.exchangeCodeForTokens(service, code, redirectUri, userId);
    console.log(`Successfully exchanged tokens for service: ${service}`);

    // Clear state cookie
    const response = NextResponse.redirect(getRedirectUrl(`/zoho-test?success=true&service=${service}`));
    response.cookies.delete(`zoho_oauth_state_${service}`);

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    console.error("Error stack:", error.stack);
    
    // baseUrl is already defined at the top of the function
    const errorUrl = `${baseUrl}/zoho-test?error=${encodeURIComponent(error.message || "OAuth callback failed")}`;
    
    // Try to redirect with error, but if that fails, return HTML response
    try {
      return NextResponse.redirect(errorUrl);
    } catch (redirectError) {
      // Fallback: return HTML page with error message and redirect script
      console.error("Failed to redirect, returning HTML fallback:", redirectError);
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>Zoho OAuth Callback</title>
  <meta http-equiv="refresh" content="3;url=${errorUrl}">
</head>
<body>
  <h1>Processing OAuth Callback...</h1>
  <p>Error: ${error.message || "OAuth callback failed"}</p>
  <p>Redirecting to <a href="${errorUrl}">zoho-test page</a>...</p>
  <script>
    setTimeout(() => {
      window.location.href = '${errorUrl}';
    }, 2000);
  </script>
</body>
</html>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }
  }
}
