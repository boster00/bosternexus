import { redirect } from "next/navigation";
import Link from "next/link";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";

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
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                Boster Nexus
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/zoho-test"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Zoho Test
                </Link>
                <Link
                  href="/freezer"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Freezer Printer
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <ButtonAccount />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

