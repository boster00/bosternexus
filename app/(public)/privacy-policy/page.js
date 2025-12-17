import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          Privacy Policy (Boster Nexus)
        </h1>

        <div className="text-sm opacity-70 mb-8">
          <strong>Effective Date:</strong> December 16, 2025
        </div>

        <div className="prose prose-sm md:prose-base max-w-none">
          <p className="leading-relaxed mb-6">
            This Privacy Policy explains how <strong>Boster Nexus</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects information when you access or use our website and services (the &quot;Service&quot;).
          </p>

          <div className="alert alert-info mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>This template is provided for general informational purposes and is not legal advice.</span>
          </div>

          <hr className="my-8 border-base-300" />

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Who We Are</h2>
            <ul className="list-none space-y-2">
              <li><strong>Service Name:</strong> Boster Nexus</li>
              <li><strong>Website:</strong> {config.domainName}</li>
              <li><strong>Operator / Company:</strong> Boster</li>
              <li><strong>Contact:</strong> <a href="mailto:boster@bosterbio.com" className="link link-primary">boster@bosterbio.com</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Personal Information</h3>
            <p className="mb-4">
              We may collect personal information you provide to us, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Account/profile information</li>
              <li>Billing and payment information (if you purchase a paid plan)</li>
            </ul>
            <p className="mb-4">
              Payment processing may be handled by a third-party payment processor. We do not store full payment card numbers on our servers.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <p className="mb-4">
              We may collect certain information automatically, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>IP address</li>
              <li>Device and browser information</li>
              <li>Pages viewed and usage activity</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">2.3 Data From Integrations / Connected Accounts</h3>
            <p className="mb-4">
              If you connect third-party services (for example accounting, CRM, support ticketing, ecommerce, or analytics tools), we may access and process data from those services as directed by you and solely to provide the Service. This may include business records and transactional data depending on what you connect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for purposes including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing, operating, and maintaining the Service</li>
              <li>Account creation and authentication</li>
              <li>Processing payments and orders (if applicable)</li>
              <li>Customer support and responding to inquiries</li>
              <li>Security, fraud prevention, and abuse detection</li>
              <li>Improving features, functionality, and user experience</li>
              <li>Sending important service-related notices (e.g., security updates, changes to policies)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Keep you signed in (where applicable)</li>
              <li>Remember preferences</li>
              <li>Understand how the Service is used and improve it</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Some parts of the Service may not work properly if cookies are disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Sharing</h2>
            <p className="mb-4 font-semibold">We do not sell your personal information.</p>
            <p className="mb-4">We may share information only in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2 mb-2">
              <li>
                <strong>Service Providers:</strong> We may use trusted third-party providers (e.g., hosting, analytics, email delivery, payment processing) that process data on our behalf and under contractual obligations to protect it.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required to comply with law, regulation, legal process, or enforceable governmental request.
              </li>
              <li>
                <strong>Security and Rights Protection:</strong> We may disclose information to protect our rights, users, the public, or to investigate fraud/security issues.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain personal information only as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements.
            </p>
            <p>
              If you request deletion of your account, we will delete or anonymize personal information where feasible, subject to legal or operational requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Security</h2>
            <p>
              We use reasonable administrative, technical, and organizational safeguards to protect information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for children under 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided personal information, please contact us so we can delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Your Rights and Choices</h2>
            <p className="mb-4">
              Depending on your location, you may have rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Accessing the personal information we hold about you</li>
              <li>Correcting inaccurate information</li>
              <li>Requesting deletion of your information</li>
              <li>Objecting to or restricting certain processing</li>
              <li>Withdrawing consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise these rights, contact us at <a href="mailto:boster@bosterbio.com" className="link link-primary">boster@bosterbio.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. International Users</h2>
            <p>
              If you access the Service from outside <strong>United States</strong>, your information may be processed and stored in countries where we or our service providers operate. Data protection laws in those jurisdictions may differ from those in your country.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Updates to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If changes are material, we will notify users by email and/or through a notice in the Service. Continued use of the Service after the effective date means you accept the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact: <a href="mailto:boster@bosterbio.com" className="link link-primary">boster@bosterbio.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
