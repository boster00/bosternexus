import { redirect } from "next/navigation";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import config from "@/config";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  // Get current user using DAL
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });
  const user = await dal.getCurrentUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  // Ensure profile exists in profiles table using DAL (fallback for users who registered before fix)
  // Use service role DAL for profile operations (system-level)
  const profileDal = new DataAccessLayer({
    useServiceRole: true,
    requireUserId: false, // We're providing userId explicitly
    autoTimestamps: true,
  });

  const existingProfile = await profileDal.getSingle("profiles", { id: user.id });

  if (!existingProfile) {
    // Create profile if it doesn't exist
    try {
      await profileDal.insert("profiles", {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        user_id: user.id, // Explicitly set user_id
      });
    } catch (profileError) {
      console.error("Failed to create profile in dashboard layout:", profileError);
    }
  }

  return <>{children}</>;
}
