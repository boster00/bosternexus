import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { modules } from "@/libs/modules";
import ModuleCard from "@/components/ModuleCard";

export const dynamic = "force-dynamic";

// Admin dashboard page - protected by (private)/layout.js
// This is the default landing page after successful authentication
export default async function AdminPage() {
  // Get current user using DAL
  const dal = new DataAccessLayer({
    useServiceRole: false,
    requireUserId: false,
    autoTimestamps: false,
  });
  const user = await dal.getCurrentUser();

  // Get user profile with settings
  let profile = null;
  let bookmarkedModuleIds = [];
  if (user) {
    try {
      profile = await dal.getSingle("profiles", { id: user.id });
      // Extract bookmarked module IDs from settings
      // Default to empty array if settings or dashboard_bookmarks doesn't exist
      if (profile?.settings && typeof profile.settings === 'object') {
        bookmarkedModuleIds = profile.settings.dashboard_bookmarks || [];
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Continue with empty bookmarks if profile fetch fails
    }
  }

  // Separate modules into bookmarked and non-bookmarked
  const bookmarkedModules = modules.filter(module => 
    bookmarkedModuleIds.includes(module.id)
  );
  const otherModules = modules.filter(module => 
    !bookmarkedModuleIds.includes(module.id)
  );

  return (
    <main className="p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Boster Nexus Admin</h1>
          <p className="text-sm opacity-70">Welcome to your business management dashboard</p>
        </div>

        {user && (
          <div className="card card-border bg-base-100 p-6">
            <h2 className="text-xl font-bold mb-4">Welcome, {user.email}</h2>
            <p className="text-sm opacity-70 mb-4">
              You are successfully authenticated and have access to the admin dashboard.
            </p>
            <div className="divider"></div>
          </div>
        )}

        {/* Bookmarked Modules Section */}
        {bookmarkedModules.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bookmarked Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isBookmarked={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Modules Section */}
        {otherModules.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Other Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isBookmarked={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="card card-border bg-base-100 p-6">
            <p className="text-sm opacity-70 text-center">
              No modules available at this time.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

