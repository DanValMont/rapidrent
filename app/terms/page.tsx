import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RapidRent - Terms of Service",
  description: "Terms of Service for RapidRent",
  keywords: "RapidRent,Terms of Service",
};

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#161c20] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto  bg-white dark:bg-black dark:shadow-[rgba(62,62,62,0.3)] shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[#1da1f2] mb-6 text-center">
          Terms of Service for RapidRent
        </h1>
        
        <div className="prose lg:prose-xl text-gray-700 dark:text-zinc-400">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the RapidRent platform, you agree to be bound by these Terms of Service. 
              If you do not agree with these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">2. Description of Service</h2>
            <p>
              RapidRent provides a platform for property rental listings, management, and communication 
              between property owners and potential renters.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">3. User Accounts</h2>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">3.1 Account Registration</h3>
            <ul className="list-disc list-inside">
              <li>Users must provide accurate and complete information during registration</li>
              <li>Each user is responsible for maintaining the confidentiality of their account</li>
              <li>Users are responsible for all activities under their account</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">3.2 Account Types</h3>
            <ul className="list-disc list-inside">
              <li>Property Owners</li>
              <li>Renters</li>
              <li>Administrators</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4    dark:text-[#1da1f2]">4. User Obligations</h2>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">4.1 Conduct</h3>
            <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">Users agree to:</p>
            <ul className="list-disc list-inside">
              <li>Use the platform for lawful purposes only</li>
              <li>Not upload harmful content</li>
              <li>Respect the privacy of other users</li>
              <li>Not engage in fraudulent activities</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">4.2 Listing Responsibilities</h3>
            <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">Property owners agree to:</p>
            <ul className="list-disc list-inside">
              <li>Provide accurate property information</li>
              <li>Update listing status promptly</li>
              <li>Comply with local housing regulations</li>
              <li>Respond to inquiries and feedback</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">5. Privacy and Data Protection</h2>
            <ul className="list-disc list-inside mt-4">
              <li>We collect and process personal data in accordance with our Privacy Policy</li>
              <li>User data is protected using industry-standard security measures</li>
              <li>Users can request data deletion as per applicable laws</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">6. Intellectual Property</h2>
            <ul className="list-disc list-inside mt-4">
              <li>All platform content is protected by copyright</li>
              <li>Users retain ownership of their original content</li>
              <li>RapidRent has a perpetual, worldwide license to display user-generated content</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">7. Fees and Payments</h2>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">7.1 Pricing</h3>
            <ul className="list-disc list-inside">
              <li>Listing fees</li>
              <li>Transaction fees</li>
              <li>Subscription plans</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-700 mt-4 dark:text-[#1da1f2]">7.2 Payment Terms</h3>
            <ul className="list-disc list-inside">
              <li>All fees are non-refundable</li>
              <li>Payments are processed through secure third-party payment processors</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">8. Limitation of Liability</h2>
            <ul className="list-disc list-inside mt-4">
              <li>RapidRent is not liable for disputes between users</li>
              <li>Maximum liability is limited to the amount paid for the service</li>
              <li>We do not guarantee rental outcomes</li>
            </ul>
          </section>
 
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">9. Dispute Resolution</h2>
            <ul className="list-disc list-inside mt-4">
              <li>Users agree to resolve disputes through mediation</li>
              <li>Binding arbitration clause</li>
              {/* <li>Governed by [Your Jurisdiction] law</li> */}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">10. Termination</h2>
            <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">RapidRent reserves the right to:</p>
            <ul className="list-disc list-inside mt-4">
              <li>Suspend or terminate accounts</li>
              <li>Modify or discontinue services</li>
              <li>Refuse service to anyone</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">11. Changes of Terms</h2>
            <ul className="list-disc list-inside mt-4">
              <li>We may update these terms periodically</li>
              <li>Continued use of the platform constitutes acceptance of new terms</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">12. Contact Information</h2>
            <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">For questions about these Terms of Service, contact:</p>
            <ul className="list-disc list-inside mt-4">
              <li>Email: legal@rapidrent.com</li>
              {/* Address: [Your Company Address] */}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-[#1da1f2]">13. Disclaimer</h2>
            <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">THIS SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED.</p>
            
          </section>
          <p className="text-xl font-medium text-gray-700 mt-4 dark:text-zinc-400">By using RapidRent, you acknowledge that you have read, understood, and agree to these Terms of Service.</p>


          {/* Additional sections would follow similar structure */}
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-zinc-400">
          <p>Last Updated: December 24, 2024</p>
          <p>© {new Date().getFullYear()} RapidRent. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;