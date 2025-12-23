import { redirect } from "next/navigation";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import config from "@/config";
import SideNav from "@/components/SideNav";

// Private layout that requires authentication
// All routes under (private) will check for user login
// If not authenticated, redirects to login page
export default async function PrivateLayout({ children }) {
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
      console.error("Failed to create profile in private layout:", profileError);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Side Navigation - Fixed */}
      <SideNav />

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

