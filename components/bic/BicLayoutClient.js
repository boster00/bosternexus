'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BicLayoutClient({ children, pagesByCategory }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } border-r bg-base-100 transition-all duration-300 ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-sm btn-ghost mb-4 w-full"
          >
            {isSidebarOpen ? '← Hide' : '→ Show'} Nav
          </button>

          {isSidebarOpen && (
            <>
              <Link href="/bic" className="block mb-6">
                <h2 className="text-xl font-bold">Boster Info Center</h2>
              </Link>

              {/* Navigation by Category */}
              <nav className="space-y-6">
                {Object.entries(pagesByCategory).map(([category, pages]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-base-content/70 mb-2">
                      {category}
                    </h3>
                    <ul className="space-y-1">
                      {pages.map((page) => (
                        <li key={page.id}>
                          <Link
                            href={`/bic/${page.url}`}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              pathname === `/bic/${page.url}` || pathname === `/bic/${page.url}/edit`
                                ? 'bg-primary text-primary-content font-semibold'
                                : 'hover:bg-base-200'
                            }`}
                          >
                            {page.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

