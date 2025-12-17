import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
// It also ensures a profile exists in the profiles table.
export async function GET(req) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  // Only process if we have a code (from Supabase OAuth flow)
  if (!code) {
    // If no code, redirect to login page instead of creating a redirect loop
    return NextResponse.redirect(requestUrl.origin + config.auth.loginUrl);
  }

  // Auth operations still use direct Supabase client
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error);
    // Redirect to signin on error
    return NextResponse.redirect(requestUrl.origin + config.auth.loginUrl);
  }

  // Ensure profile exists in profiles table using DAL
  if (user) {
    // Use DAL with service role for profile creation (system operation)
    const dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // We're providing userId explicitly
      autoTimestamps: true,
    });

    const existingProfile = await dal.getSingle("profiles", { id: user.id });

    if (!existingProfile) {
      // Create profile if it doesn't exist
      try {
        await dal.insert("profiles", {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          user_id: user.id, // Explicitly set user_id
        });
      } catch (profileError) {
        console.error("Failed to create profile in callback:", profileError);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
