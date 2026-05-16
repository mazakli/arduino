import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Arduino Forum Privacy Policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: May 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Data We Collect</h2>
          <div className="text-gray-600 space-y-2 text-sm leading-relaxed">
            <p>When you use Arduino Forum, we may collect the following information:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Account information:</strong> username, email address, and password
                hash when you register with email/password.
              </li>
              <li>
                <strong>OAuth profile data:</strong> name and email provided by Google or
                Facebook when you sign in via those services.
              </li>
              <li>
                <strong>Content you create:</strong> posts, replies, and any files you
                upload to the forum.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, interactions, and anonymous
                analytics.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Data</h2>
          <div className="text-gray-600 space-y-2 text-sm leading-relaxed">
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>To provide and maintain the forum service.</li>
              <li>To authenticate you and keep your account secure.</li>
              <li>To send notifications about replies to your posts.</li>
              <li>To improve the platform based on usage patterns.</li>
              <li>To generate AI-assisted answers using your post content as context.</li>
            </ul>
            <p>
              We do not sell your personal data to third parties.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Cookies</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We use cookies to maintain your session and preferences. Session cookies are
            deleted when you close your browser. Authentication cookies persist for up to
            30 days. See our{" "}
            <a href="/cookies" className="text-[#00979D] hover:underline">
              Cookie Policy
            </a>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
          <div className="text-gray-600 text-sm space-y-3 leading-relaxed">
            <div>
              <strong className="text-gray-800">Google OAuth:</strong> If you sign in with
              Google, Google may collect data per their{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00979D] hover:underline"
              >
                Privacy Policy
              </a>
              .
            </div>
            <div>
              <strong className="text-gray-800">Facebook OAuth:</strong> If you sign in
              with Facebook, Meta may collect data per their{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00979D] hover:underline"
              >
                Privacy Policy
              </a>
              .
            </div>
            <div>
              <strong className="text-gray-800">Anthropic AI:</strong> When AI-assisted
              answers are generated, post content is sent to Anthropic&apos;s API. See
              Anthropic&apos;s{" "}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00979D] hover:underline"
              >
                Privacy Policy
              </a>
              .
            </div>
            <div>
              <strong className="text-gray-800">Neon (PostgreSQL):</strong> Your data is
              stored in Neon&apos;s managed PostgreSQL cloud service.
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Your Rights</h2>
          <div className="text-gray-600 text-sm space-y-2 leading-relaxed">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Object to processing of your data.</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:contact@arduinoforum.com" className="text-[#00979D] hover:underline">
                contact@arduinoforum.com
              </a>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            For privacy-related inquiries, please email us at{" "}
            <a href="mailto:contact@arduinoforum.com" className="text-[#00979D] hover:underline">
              contact@arduinoforum.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
