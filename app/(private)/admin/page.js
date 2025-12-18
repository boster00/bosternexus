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
            <div className="space-y-2 text-sm">
              <p><strong>User ID:</strong> {user.id}</p>
              {user.user_metadata?.name && (
                <p><strong>Name:</strong> {user.user_metadata.name}</p>
              )}
            </div>
          </div>
        )}

        <div className="card card-border bg-base-100 p-6">
          <h2 className="text-2xl font-bold mb-4">About Boster Nexus</h2>
          <div className="space-y-4 text-sm">
            <p className="opacity-80">
              Boster Nexus is an integrated business management platform designed to streamline operations 
              for Boster Bio. The system provides comprehensive tools for managing inventory, sales, 
              purchasing, and customer relationships through seamless integration with Zoho Books, 
              Zoho CRM, and Zoho Desk.
            </p>
            <div className="divider"></div>
            <h3 className="font-bold text-lg">What You Can Do</h3>
            <ul className="list-disc list-inside space-y-2 opacity-80 ml-4">
              <li><strong>Zoho Integration:</strong> Test and manage Zoho API connections, sync historical data, 
                and calculate inventory reorder levels based on sales history</li>
              <li><strong>Inventory Management:</strong> View and manage product inventory, track stock levels, 
                and calculate optimal reorder points</li>
              <li><strong>Freezer Label Printing:</strong> Generate and print freezer storage labels with SKU 
                information and space allocation</li>
              <li><strong>Data Synchronization:</strong> Automatically sync sales orders, invoices, purchase orders, 
                and bills from Zoho Books to maintain up-to-date records</li>
              <li><strong>Historical Data Sync:</strong> Import and sync historical transaction data from Zoho 
                with resumable batch processing</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card card-border bg-base-100 p-6">
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/zoho-test" className="block text-primary hover:underline">
                → Zoho Test & Configuration
              </Link>
              <Link href="/freezer" className="block text-primary hover:underline">
                → Freezer Label Printer
              </Link>
            </div>
          </div>
          <div className="card card-border bg-base-100 p-6">
            <h3 className="font-bold text-lg mb-2">System Status</h3>
            <p className="text-sm opacity-70">
              All systems operational. Use the navigation bar above to access different modules and features.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

