import { NextResponse } from "next/server";
import zoho from "@/libs/zoho";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

/**
 * API route for testing Zoho API operations
 * Supports:
 * - Authentication check
 * - Get list from module
 * - Get record by ID
 * - Search by criteria
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, service, module, recordId, searchCriteria, limit, params } = body;

    // Get current user for user-specific tokens using DAL
    const dal = new DataAccessLayer({
      useServiceRole: false,
      requireUserId: false,
      autoTimestamps: false,
    });
    const userId = await dal.getCurrentUserId();

    if (!action || !service) {
      return NextResponse.json(
        { error: "action and service are required" },
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

    let result;

    switch (action) {
      case "check":
        // Check authentication status - use getAccessToken which auto-refreshes expired tokens
        // This ensures expired tokens are automatically refreshed
        
        // Use getAccessToken which will automatically refresh expired tokens
        const checkedAccessToken = await zoho.getAccessToken(service, userId);
        
        if (!checkedAccessToken) {
          return NextResponse.json({
            authenticated: false,
            message: `No access token found for Zoho. Please authorize first. (Tokens are shared across all services)`,
          });
        }

        // Get full token details for display (after potential refresh)
        const tokenDetails = await zoho.authService.getToken(service, userId);
        
        // Format token details for display (mask sensitive parts)
        const formatToken = (token) => {
          if (!token) return null;
          if (token.length <= 20) return token;
          return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
        };

        // Check if token is expired (after potential refresh)
        const isExpired = tokenDetails?.expiresAt ? new Date(tokenDetails.expiresAt) <= new Date() : false;

        return NextResponse.json({
          authenticated: !isExpired,
          message: !isExpired
            ? `Token exists and is valid until ${tokenDetails?.expiresAt ? new Date(tokenDetails.expiresAt).toLocaleString() : 'unknown'}`
            : `Token exists but has expired. Auto-refresh may have failed.`,
          tokenDetails: tokenDetails ? {
            accessToken: formatToken(tokenDetails.accessToken),
            accessTokenFull: tokenDetails.accessToken, // Full token for display
            refreshToken: tokenDetails.refreshToken ? formatToken(tokenDetails.refreshToken) : null,
            refreshTokenFull: tokenDetails.refreshToken || null, // Full token for display
            expiresAt: tokenDetails.expiresAt ? tokenDetails.expiresAt.toISOString() : null,
            isExpired,
            metadata: tokenDetails.metadata || {},
          } : null,
        });

      case "authenticate":
        // Verify authentication with live API call (used for refresh status button)
        // Note: Zoho tokens are shared across all services, so checking any service works
        const verifiedAccessToken = await zoho.getAccessToken(service, userId);
        if (!verifiedAccessToken) {
          return NextResponse.json({
            authenticated: false,
            message: `No access token found for Zoho. Please authorize first. (Tokens are shared across all services)`,
          });
        }

        // Get full token details from auth service
        const verifyTokenDetails = await zoho.authService.getToken(service, userId);
        
        // Try to make a simple request to verify token with timeout
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Authentication check timed out after 10 seconds")), 10000);
          });

          // Create the API call promise
          let apiCallPromise;
          if (service === "books") {
            // Try to get organization info or a simple endpoint
            apiCallPromise = zoho.get("books", "/organizations", {}, userId);
          } else if (service === "crm") {
            // Try to get modules list
            apiCallPromise = zoho.get("crm", "/settings/modules", {}, userId);
          } else if (service === "desk") {
            // Try to get tickets with limit 1
            apiCallPromise = zoho.get("desk", "/tickets", { limit: 1 }, userId);
          } else {
            throw new Error(`Unknown service: ${service}`);
          }

          // Race between API call and timeout
          await Promise.race([apiCallPromise, timeoutPromise]);

          // Format token details for display (mask sensitive parts)
          const formatTokenForVerify = (token) => {
            if (!token) return null;
            if (token.length <= 20) return token;
            return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
          };

          return NextResponse.json({
            authenticated: true,
            message: `Successfully authenticated with Zoho ${service}`,
            tokenDetails: verifyTokenDetails ? {
              accessToken: formatTokenForVerify(verifyTokenDetails.accessToken),
              accessTokenFull: verifyTokenDetails.accessToken, // Full token for display
              refreshToken: verifyTokenDetails.refreshToken ? formatTokenForVerify(verifyTokenDetails.refreshToken) : null,
              refreshTokenFull: verifyTokenDetails.refreshToken || null, // Full token for display
              expiresAt: verifyTokenDetails.expiresAt ? verifyTokenDetails.expiresAt.toISOString() : null,
              isExpired: verifyTokenDetails.expiresAt ? verifyTokenDetails.expiresAt < new Date() : false,
              metadata: verifyTokenDetails.metadata || {},
            } : null,
          });
        } catch (error) {
          console.error(`Authentication check failed for ${service}:`, error.message);
          return NextResponse.json({
            authenticated: false,
            message: `Authentication failed: ${error.message}`,
            error: error.message,
          });
        }

      case "getList":
        if (!module) {
          return NextResponse.json(
            { error: "module is required for getList action" },
            { status: 400 }
          );
        }

        // Build params with correct parameter name based on service
        // Books and CRM use 'per_page', Desk uses 'limit'
        const limitValue = limit || 5;
        const listParams = {
          ...(params || {}),
        };

        if (service === "books") {
          // Zoho Books uses 'per_page' parameter
          listParams.per_page = limitValue;
          // For Books, module could be items, invoices, salesorders, etc.
          result = await zoho.get("books", `/${module}`, listParams, userId);
        } else if (service === "crm") {
          // Zoho CRM uses 'per_page' parameter
          listParams.per_page = limitValue;
          // For CRM, module is the module name (Contacts, Leads, etc.)
          result = await zoho.getCrmRecords(module, listParams, userId);
        } else if (service === "desk") {
          // Zoho Desk uses 'limit' parameter
          listParams.limit = limitValue;
          // For Desk, module could be tickets, contacts, etc.
          result = await zoho.get("desk", `/${module}`, listParams, userId);
        }

        // Response is now normalized by Zoho client to have 'data' field
        // Extract count from normalized data array
        const itemCount = Array.isArray(result?.data) ? result.data.length : 0;

        return NextResponse.json({
          success: true,
          data: result?.data || result, // Use normalized data if available
          rawResponse: result, // Include full raw Zoho response (original JSON from Zoho API)
          rawZohoJson: result, // Alias for clarity - this is the raw JSON from Zoho
          count: itemCount,
        });

      case "getById":
        if (!module || !recordId) {
          return NextResponse.json(
            { error: "module and recordId are required for getById action" },
            { status: 400 }
          );
        }

        if (service === "books") {
          result = await zoho.get("books", `/${module}/${recordId}`, {}, userId);
        } else if (service === "crm") {
          result = await zoho.getCrmRecord(module, recordId, userId);
        } else if (service === "desk") {
          result = await zoho.get("desk", `/${module}/${recordId}`, {}, userId);
        }

        return NextResponse.json({
          success: true,
          data: result,
        });

      case "search":
        if (!module || !searchCriteria) {
          return NextResponse.json(
            { error: "module and searchCriteria are required for search action" },
            { status: 400 }
          );
        }

        if (service === "books") {
          // Books API uses 'search_text' parameter
          result = await zoho.get("books", `/${module}`, {
            search_text: searchCriteria,
            ...(params || {}),
          }, userId);
        } else if (service === "crm") {
          // CRM API uses 'criteria' parameter for search
          result = await zoho.get("crm", `/${module}/search`, {
            criteria: searchCriteria,
            ...(params || {}),
          }, userId);
        } else if (service === "desk") {
          // Desk API uses 'q' parameter for search
          result = await zoho.get("desk", `/${module}`, {
            q: searchCriteria,
            ...(params || {}),
          }, userId);
        }

        return NextResponse.json({
          success: true,
          data: result,
          count: Array.isArray(result?.data) ? result.data.length : result?.data?.length || 0,
        });

      default:
        return NextResponse.json(
          { error: `Invalid action. Must be one of: check, authenticate, getList, getById, search` },
          { status: 400 }
        );
    }
  } catch (error) {
    
    console.error("Zoho API error:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
