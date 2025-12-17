import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <div className="p-5 md:p-8">
        <Link href="/" className="btn btn-ghost mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-extrabold pb-6">
          Terms & Services (Boster Nexus)
        </h1>
        
        <div className="text-sm opacity-70 mb-8">
          <strong>Effective Date:</strong> December 16, 2025
        </div>

        <div className="prose prose-sm md:prose-base max-w-none">
          <p className="leading-relaxed mb-6">
            These Terms & Services (&quot;Terms&quot;) govern your access to and use of <strong>Boster Nexus</strong> (the &quot;Service&quot;). By accessing or using the Service, you agree to these Terms.
          </p>

          <div className="alert alert-info mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>This template is provided for general informational purposes and is not legal advice.</span>
          </div>

          <hr className="my-8 border-base-300" />

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Company Information</h2>
            <ul className="list-none space-y-2">
              <li><strong>Service Name:</strong> Boster Nexus</li>
              <li><strong>Website:</strong> {config.domainName}</li>
              <li><strong>Operator / Company:</strong> Boster (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;)</li>
              <li><strong>Contact:</strong> boster@bosterbio.com</li>
              <li><strong>Address:</strong> 3942 Valley Ave Ste B, Pleasanton CA, 94566</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Description of the Service</h2>
            <p className="mb-4">
              Boster Nexus is a web application that helps manage business operations and workflows, including integrations with third-party systems such as accounting, CRM, support ticketing, ecommerce, and analytics platforms (for example Zoho products, Magento, GA4/BigQuery) and internal tools (the &quot;Integrations&quot;).
            </p>
            <p className="mb-4">The Service may include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Internal dashboards, workflows, and reports</li>
              <li>Data synchronization/caching and derived operational signals</li>
              <li>Customer-facing widgets embedded in other sites (e.g., orders, quotes, loyalty)</li>
              <li>Administrative tools for operations, product information management (PIM), and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Eligibility and Accounts</h2>
            <p className="mb-4">
              You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Service.
            </p>
            <p className="mb-4">If you create an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide accurate information</li>
              <li>Keep credentials secure</li>
              <li>Be responsible for activity under your account</li>
            </ul>
            <p>
              We may suspend or terminate accounts for suspected misuse or security risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Use the Service in violation of law or regulations</li>
              <li>Interfere with or disrupt the Service or networks</li>
              <li>Attempt unauthorized access to systems or data</li>
              <li>Upload malware or harmful code</li>
              <li>Reverse engineer or attempt to extract source code except to the extent permitted by law</li>
            </ul>
            <p>
              We may limit access, rate-limit, or block abusive traffic to protect the Service and third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Integrations and Third-Party Services</h2>
            <p className="mb-4">The Service may connect to third-party platforms. You acknowledge:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Third-party services have their own terms and privacy policies</li>
              <li>We do not control third-party systems or outages</li>
              <li>Functionality may change if third parties change their APIs, policies, or availability</li>
            </ul>
            <p>
              You are responsible for ensuring you have the rights and permissions to connect and use any third-party accounts with the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Data, Content, and Permissions</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">6.1 Your Content</h3>
            <p className="mb-4">
              You retain ownership of content and data you submit or connect to the Service (&quot;Customer Content&quot;). You grant us a limited license to host, process, and transmit Customer Content solely to provide and improve the Service, including operating integrations and generating derived outputs (e.g., reports, dashboards, alerts).
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.2 Derived and Cached Data</h3>
            <p className="mb-4">
              The Service may cache third-party data and generate derived data (e.g., operational signals, matches, classifications, analytics summaries). You understand cached/derived data may not always reflect real-time third-party state.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.3 Feedback</h3>
            <p className="mb-4">
              If you provide feedback, suggestions, or ideas, you grant us the right to use them without restriction or compensation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Privacy</h2>
            <p className="mb-4">
              We collect and process personal data as described in our Privacy Policy: <Link href="/privacy-policy" className="link link-primary">Privacy Policy</Link>.
            </p>
            <p className="mb-2">
              <strong>User data collected may include:</strong> name, email, account/profile information, and (if applicable) billing/payment details via a third-party payment processor.
            </p>
            <p>
              <strong>Non-personal data collected may include:</strong> cookies, device/browser data, and usage analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Fees, Billing, and Taxes (If Applicable)</h2>
            <p className="mb-4">If the Service includes paid plans:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Fees, billing frequency, and plan details will be shown at purchase or in your account settings</li>
              <li>Payments may be handled by a third-party processor; we do not store full payment card numbers</li>
              <li>You are responsible for applicable taxes unless stated otherwise</li>
            </ul>
            <p>
              <strong>Refunds:</strong> All sales are final except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Communications</h2>
            <p className="mb-4">You agree we may contact you regarding:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Account, security, and operational notices</li>
              <li>Updates to features, availability, or policies</li>
              <li>Legal or compliance communications</li>
            </ul>
            <p>
              Where required, you may opt out of marketing communications, but not essential service notices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Availability, Support, and Changes</h2>
            <p className="mb-4">
              We may modify, suspend, or discontinue the Service (or any part of it) at any time.
            </p>
            <p>
              We do not guarantee uninterrupted availability, and scheduled maintenance may occur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Intellectual Property</h2>
            <p className="mb-4">
              The Service, including software, design, branding, and documentation, is owned by the Company and protected by intellectual property laws.
            </p>
            <p>
              You receive a limited, non-exclusive, non-transferable right to access and use the Service in accordance with these Terms. You may not resell, sublicense, or commercially exploit the Service unless explicitly authorized in writing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Security</h2>
            <p className="mb-4">
              We implement reasonable security measures, but no system is 100% secure. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Using strong passwords and securing devices</li>
              <li>Limiting who has access to your third-party accounts</li>
              <li>Promptly notifying us of suspected compromise at <a href="mailto:boster@bosterbio.com" className="link link-primary">boster@bosterbio.com</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Disclaimers</h2>
            <p className="mb-4 font-semibold">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR THAT INTEGRATIONS WILL ALWAYS FUNCTION.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Limitation of Liability</h2>
            <p className="mb-4 font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>WE WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
              <li>OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID TO US FOR THE SERVICE IN THE PAST 12 MONTHS, WHICHEVER IS LOWER</li>
            </ul>
            <p>
              Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">15. Termination</h2>
            <p className="mb-4">
              You may stop using the Service at any time.
            </p>
            <p>
              We may suspend or terminate access if you violate these Terms or if required for legal/security reasons. Upon termination, your right to use the Service ends immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">16. Governing Law and Disputes</h2>
            <p className="mb-4">
              These Terms are governed by the laws of <strong>California, United States</strong>, without regard to conflict of law principles.
            </p>
            <p>
              Any disputes will be resolved in the courts located in <strong>Pleasanton, California</strong>, unless applicable law requires otherwise.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">17. Updates to These Terms</h2>
            <p>
              We may update these Terms from time to time. If changes are material, we will notify users by email (and/or by posting a notice in the Service). Continued use after the effective date of updated Terms constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">18. Contact</h2>
            <p>
              Questions about these Terms: <a href="mailto:boster@bosterbio.com" className="link link-primary">boster@bosterbio.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TOS;
