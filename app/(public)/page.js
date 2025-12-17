import ButtonSignin from "@/components/ButtonSignin";

export default function Page() {
  return (
    <>
      <header className="p-4 flex justify-end max-w-7xl mx-auto">
        <ButtonSignin text="Login" />
      </header>
      <main>
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center gap-8 px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Boster Nexus
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-3xl leading-relaxed">
            Internal operations and enablement platform centralizing Boster&apos;s cross-system workflows across Zoho Books, Zoho CRM, Zoho Desk, Magento, and marketing analytics.
          </p>
          <ButtonSignin text="Sign In to Continue" extraStyle="btn-primary btn-lg" />
        </section>

        {/* Core Functions Section */}
        <section className="max-w-7xl mx-auto px-8 py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Core Functions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Zoho Integration */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="font-bold text-xl">Zoho Integration</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Sync, cache, and reconcile data across all Zoho systems with rate-limited webhook ingestion.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Zoho Books sync + reconciliation</li>
                <li>• Zoho CRM ingestion + tools</li>
                <li>• Zoho Desk support ops</li>
                <li>• Daily reconciliation jobs</li>
              </ul>
            </div>

            {/* Procurement & Fulfillment */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-xl">Procurement & Fulfillment</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Operational signals, guardrails, and SO/PO management with local reconciliation logic.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Open PO quantity calculations</li>
                <li>• Backorder / on-the-way signals</li>
                <li>• SO listing warnings & guardrails</li>
                <li>• Bill↔PO line matching</li>
              </ul>
            </div>

            {/* Analytics & Reporting */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-bold text-xl">Analytics & Reporting</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Marketing attribution, OOA reporting, and customizable measurement dashboards.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Marketing attribution / OOA</li>
                <li>• First-touch & last-touch views</li>
                <li>• Sales analytics + AI curation</li>
                <li>• Customizable dashboard layouts</li>
              </ul>
            </div>

            {/* Product Management */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="font-bold text-xl">Product Management</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                PIM system with bulk edits, image management, and feed generation for storefront sync.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Single + bulk product edits</li>
                <li>• Image & options management</li>
                <li>• CSV/feed exports</li>
                <li>• Google Merchant Center feeds</li>
              </ul>
            </div>

            {/* Quote Lifecycle */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-bold text-xl">Quote Automation</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Quote lifecycle automation with conversion tracking and CRM integration.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Quote conversion automation</li>
                <li>• CRM + Books integration</li>
                <li>• Multi-entity creation</li>
              </ul>
            </div>

            {/* Customer Portal */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="font-bold text-xl">Customer Portal</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Embeddable widgets for orders, quotes, projects, and tracking.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• My orders / quotes / projects</li>
                <li>• Quote details widgets</li>
                <li>• Tracking link integration</li>
                <li>• Magento-authenticated</li>
              </ul>
            </div>

            {/* Loyalty System */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-xl">Loyalty System</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Points-based loyalty ledger with redemption options and gamification.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Purchase → points conversion</li>
                <li>• Product credit redemption</li>
                <li>• Cash redemption options</li>
                <li>• Gamification features</li>
              </ul>
            </div>

            {/* Notifications & Monitoring */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="font-bold text-xl">Notifications & Monitoring</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Automated notifications and alerting framework for operational events.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Invoice sent notifications</li>
                <li>• Alert framework</li>
                <li>• Dashboard warnings</li>
                <li>• Email notifications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Architecture Section */}
        <section className="bg-base-200/50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Data Architecture
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="badge badge-primary badge-lg mb-4">Source of Truth</div>
                <h3 className="font-bold text-lg mb-2">Zoho Books</h3>
                <p className="text-sm opacity-70">
                  Orders, invoices, POs, bills, and inventory state are managed in Zoho Books as the authoritative source.
                </p>
              </div>
              <div className="text-center">
                <div className="badge badge-secondary badge-lg mb-4">Cache & Warehouse</div>
                <h3 className="font-bold text-lg mb-2">Nexus Database</h3>
                <p className="text-sm opacity-70">
                  Stores raw JSON caches, derived state, guardrail exceptions, and internal-only data for fast access and operations.
                </p>
              </div>
              <div className="text-center">
                <div className="badge badge-accent badge-lg mb-4">Analytics Store</div>
                <h3 className="font-bold text-lg mb-2">BigQuery</h3>
                <p className="text-sm opacity-70">
                  GA4-scale event data remains in BigQuery; Nexus pulls only what it needs on-demand for reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-7xl mx-auto px-8 py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Rate-Limited Sync</h3>
                <p className="text-sm opacity-70">
                  Intelligent rate limiting (1 req/sec) with async job queuing to prevent Zoho API overload while maintaining data freshness.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Operational Guardrails</h3>
                <p className="text-sm opacity-70">
                  Automated validation and warnings for sales orders, procurement issues, and duplicate prevention to maintain data integrity.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Customizable Dashboards</h3>
                <p className="text-sm opacity-70">
                  User-customizable 12-column grid layouts with saved configurations and report definitions stored in the database.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Embeddable Widgets</h3>
                <p className="text-sm opacity-70">
                  Widget components that can be embedded in Magento pages and Zoho UI via iframe, keeping logic centralized in Nexus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-content py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to streamline your operations?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Sign in to access Boster Nexus and start managing your cross-system workflows.
            </p>
            <ButtonSignin text="Sign In to Boster Nexus" extraStyle="btn-lg btn-base-100 text-primary" />
          </div>
        </section>
      </main>
    </>
  );
}
