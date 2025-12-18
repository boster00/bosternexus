import Link from "next/link";
import ButtonAccount from "@/components/ButtonAccount";

// Admin layout - wraps all admin routes
// Note: Authentication is already handled by the parent (private)/layout.js
// This layout can be used for admin-specific UI elements, navigation, or future role/permission checks
export default async function AdminLayout({ children }) {
  // TODO: Add admin role/permission checks here when roles are implemented
  // For now, all authenticated users can access admin

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

