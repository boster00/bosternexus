// Admin layout - wraps all admin routes
// Note: Authentication is already handled by the parent (private)/layout.js
// This layout can be used for admin-specific UI elements, navigation, or future role/permission checks
export default async function AdminLayout({ children }) {
  // TODO: Add admin role/permission checks here when roles are implemented
  // For now, all authenticated users can access admin

  return <>{children}</>;
}

