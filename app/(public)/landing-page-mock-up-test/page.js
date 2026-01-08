import ButtonLead from "@/components/ButtonLead";

export default function LandingPageMockUpTest() {
  return (
    <>
      {/* Header */}
      <header className="p-4 flex justify-end max-w-7xl mx-auto">
        <a
          href="https://www.bosterbio.com"
          className="btn btn-ghost btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More About Boster
        </a>
      </header>

      <main>
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center gap-8 px-8 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="badge badge-primary badge-lg mb-4">
            Rapid IHC & IF Services
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-5xl">
            Accelerate Your Therapeutic Development with{" "}
            <span className="text-primary">3000+ Validated Antibodies</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-3xl leading-relaxed">
            Fast-track your drug discovery and development with our comprehensive IHC and IF assay services. 
            Get results in 1–2 weeks with our extensive library of pre-validated antibodies, automated platforms, 
            and expert pathologist review—all backed by 24/7 technical support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <ButtonLead extraStyle="btn-primary btn-lg" />
            <a
              href="tel:+1-888-466-3603"
              className="btn btn-outline btn-lg"
            >
              Call (888) 466-3603
            </a>
          </div>
          <p className="text-sm opacity-60 mt-2">
            Free consultation • No commitment required
          </p>
        </section>

        {/* Problem Agitation Section */}
        <section className="bg-neutral text-neutral-content py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="max-w-3xl mx-auto font-extrabold text-3xl md:text-4xl tracking-tight mb-6 md:mb-8">
              Delays in IHC Assays Slow Down Your Entire Development Pipeline
            </h2>
            <p className="max-w-xl mx-auto text-lg opacity-90 leading-relaxed mb-12 md:mb-16">
              When antibody validation and assay development take too long, every day lost compounds into weeks 
              of delayed milestones—impacting regulatory submissions, clinical trial timelines, and market entry dates.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
              <div className="card card-border bg-neutral-focus p-6 max-w-xs">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="font-bold text-xl mb-3">Weeks Spent Validating</h3>
                <p className="text-sm opacity-80">
                  Internal antibody validation can take 4–6 weeks, delaying critical decision-making points in your research.
                </p>
              </div>

              <div className="hidden md:block text-4xl opacity-50">→</div>

              <div className="card card-border bg-neutral-focus p-6 max-w-xs">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-bold text-xl mb-3">Missed Timelines</h3>
                <p className="text-sm opacity-80">
                  Project delays cascade into missed regulatory windows, extended clinical trials, and delayed revenue generation.
                </p>
              </div>

              <div className="hidden md:block text-4xl opacity-50">→</div>

              <div className="card card-border bg-neutral-focus p-6 max-w-xs">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold text-xl mb-3">Increased Costs</h3>
                <p className="text-sm opacity-80">
                  Every day of delay compounds costs: facility overhead, extended team salaries, and opportunity costs from delayed market entry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Pharmaceutical Companies Choose Our IHC/IF Services
          </h2>
          <p className="text-center text-lg opacity-70 mb-12 max-w-2xl mx-auto">
            We combine extensive validated antibody resources with rapid turnaround to keep your development pipeline moving forward.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Feature 1: 3000+ Validated Antibodies */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">3000+ Validated Antibodies</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Access our extensive library of pre-validated antibodies, ready for immediate use. Skip weeks of validation 
                work and start generating data from day one.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Pre-validated for IHC and IF</li>
                <li>• Wide range of targets</li>
                <li>• Multiple species and applications</li>
                <li>• Continuously expanding catalog</li>
              </ul>
            </div>

            {/* Feature 2: Rapid Turnaround */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">1–2 Week Turnaround</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Get high-quality results delivered in 1–2 weeks after receiving your materials. Our optimized workflows 
                and automated platforms ensure consistency without sacrificing speed.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Expedited processing available</li>
                <li>• Automated staining platforms</li>
                <li>• Streamlined workflows</li>
                <li>• Real-time project tracking</li>
              </ul>
            </div>

            {/* Feature 3: 24/7 Technical Support */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">24/7 Technical Support</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Access experienced scientists around the clock to address any concerns, answer questions, or troubleshoot 
                issues—ensuring your project stays on track, no matter when questions arise.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Round-the-clock availability</li>
                <li>• Expert scientific guidance</li>
                <li>• Rapid response times</li>
                <li>• Proactive project updates</li>
              </ul>
            </div>

            {/* Feature 4: Automated Platforms */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Automated Staining Platforms</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                State-of-the-art automated systems ensure consistent, high-quality staining across various tissue types, 
                reducing variability and improving reproducibility.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Leica Bond platform</li>
                <li>• Ventana systems</li>
                <li>• Consistent quality control</li>
                <li>• Reduced human error</li>
              </ul>
            </div>

            {/* Feature 5: Expert Pathologist Review */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Expert Pathologist Review</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Certified pathologists provide thorough evaluations and interpretations of your assay results, adding 
                clinical context and ensuring data quality for regulatory submissions.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Certified pathologists</li>
                <li>• Detailed evaluations</li>
                <li>• Clinical context included</li>
                <li>• Regulatory-ready reports</li>
              </ul>
            </div>

            {/* Feature 6: Multiplexing Capabilities */}
            <div className="card card-border bg-base-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Single & Multiplex Panels</h3>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Both single and multiplex IHC/IF panels available to detect multiple biomarkers simultaneously, 
                providing comprehensive data from limited sample material.
              </p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Single marker detection</li>
                <li>• Multiplex capabilities</li>
                <li>• Comprehensive biomarker panels</li>
                <li>• Optimized protocols</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-base-200/50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Designed for Pharmaceutical Drug Development
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="badge badge-primary badge-lg mb-4">Speed</div>
                <h3 className="font-bold text-lg mb-2">Fast-Track Your Research</h3>
                <p className="text-sm opacity-70">
                  Pre-validated antibodies eliminate weeks of validation work, allowing you to start generating 
                  critical data immediately and maintain your development timeline.
                </p>
              </div>
              <div className="text-center">
                <div className="badge badge-secondary badge-lg mb-4">Quality</div>
                <h3 className="font-bold text-lg mb-2">Regulatory-Ready Results</h3>
                <p className="text-sm opacity-70">
                  Our GLP-compliant processes, expert pathologist review, and automated quality control ensure 
                  your data meets the standards required for regulatory submissions.
                </p>
              </div>
              <div className="text-center">
                <div className="badge badge-accent badge-lg mb-4">Partnership</div>
                <h3 className="font-bold text-lg mb-2">Dedicated Support</h3>
                <p className="text-sm opacity-70">
                  24/7 access to experienced scientists means you&apos;re never alone. Get guidance on assay design, 
                  troubleshooting, and data interpretation whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What You Get with Our IHC/IF Services
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Assay Development & Optimization</h3>
                <p className="text-sm opacity-70">
                  Custom assay development and optimization services tailored to your specific research needs, 
                  ensuring robust and reproducible results.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Comprehensive Data Packages</h3>
                <p className="text-sm opacity-70">
                  Receive detailed reports with high-resolution images, quantitative analysis, pathologist interpretations, 
                  and all data needed for your regulatory documentation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Regulatory Compliance</h3>
                <p className="text-sm opacity-70">
                  GLP-compliant laboratories and processes that meet the stringent quality standards required for 
                  preclinical and clinical research submissions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Flexible Project Management</h3>
                <p className="text-sm opacity-70">
                  Real-time project tracking, regular status updates, and flexible scheduling to accommodate your 
                  timeline and priorities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-primary text-primary-content py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Accelerate Your IHC/IF Assay Workflows?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Get started with a free consultation. Our team will discuss your project requirements and show you 
              how our 3000+ validated antibodies and rapid turnaround can keep your development pipeline on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonLead extraStyle="btn-lg btn-base-100 text-primary" />
              <a
                href="tel:+1-888-466-3603"
                className="btn btn-lg btn-base-100 text-primary btn-outline border-base-content/20"
              >
                Call (888) 466-3603
              </a>
            </div>
            <p className="text-sm opacity-80 mt-6">
              24/7 Technical Support Available • No Commitment Required
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

