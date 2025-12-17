import ButtonAccount from "@/components/ButtonAccount";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

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

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Boster Nexus Admin</h1>
          <ButtonAccount />
        </div>

        {user && (
          <div className="card card-border bg-base-100 p-6">
            <h2 className="text-xl font-bold mb-4">Welcome, {user.email}</h2>
            <p className="text-sm opacity-70 mb-4">
              You are successfully authenticated and have access to the admin dashboard.
            </p>
            <div className="divider"></div>
            <div className="space-y-2 text-sm">
              <p><strong>User ID:</strong> {user.id}</p>
              {user.user_metadata?.name && (
                <p><strong>Name:</strong> {user.user_metadata.name}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card card-border bg-base-100 p-6">
            <h3 className="font-bold text-lg mb-2">Getting Started</h3>
            <p className="text-sm opacity-70">
              This is your admin dashboard. From here you can access all Boster Nexus functions and modules.
            </p>
          </div>
          <div className="card card-border bg-base-100 p-6">
            <h3 className="font-bold text-lg mb-2">Admin Functions</h3>
            <p className="text-sm opacity-70">
              Admin modules and functions will be available here as they are developed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

