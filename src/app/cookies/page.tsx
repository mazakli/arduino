import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Arduino Forum Cookie Policy - what cookies we use and how to manage them.",
};

const cookies = [
  {
    name: "next-auth.session-token",
    purpose: "Authenticates your session after login",
    duration: "30 days",
  },
  {
    name: "next-auth.csrf-token",
    purpose: "Protects against cross-site request forgery",
    duration: "Session",
  },
  {
    name: "next-auth.callback-url",
    purpose: "Remembers where to redirect after login",
    duration: "Session",
  },
  {
    name: "__Secure-next-auth.session-token",
    purpose: "Secure version of session token (HTTPS only)",
    duration: "30 days",
  },
  {
    name: "_ga / _gid",
    purpose: "Anonymous analytics via Google Analytics (if enabled)",
    duration: "Up to 2 years",
  },
];

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-500">Last updated: May 2026</p>
      </div>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files stored on your device by your browser. They help
            websites remember information about your visit, making your next visit easier
            and the site more useful to you. Cookies cannot run programs or deliver viruses
            to your device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-1">Session Cookies</h3>
              <p>
                Temporary cookies that expire when you close your browser. Used to maintain
                state during your visit, such as your login status and CSRF protection.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-1">Authentication Cookies</h3>
              <p>
                Persistent cookies that keep you logged in across browser sessions. These
                are set by NextAuth.js when you choose to remain signed in. They last up
                to 30 days.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-1">Analytics Cookies</h3>
              <p>
                Anonymous cookies that help us understand how visitors use the site. No
                personally identifiable information is collected. You can opt out via your
                browser settings.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cookies We Set</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Cookie Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cookies.map((cookie) => (
                  <tr key={cookie.name} className="bg-white">
                    <td className="px-4 py-3 font-mono text-gray-800 text-xs">{cookie.name}</td>
                    <td className="px-4 py-3 text-gray-600">{cookie.purpose}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{cookie.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">How to Manage Cookies</h2>
          <div className="text-gray-600 space-y-3 leading-relaxed">
            <p>
              You can control and manage cookies through your browser settings. Note that
              disabling authentication cookies will prevent you from staying logged in.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Options → Privacy & Security → Cookies
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions
              </li>
            </ul>
            <p>
              For questions about our cookie usage, contact us at{" "}
              <a
                href="mailto:contact@arduinoforum.com"
                className="text-[#00979D] hover:underline"
              >
                contact@arduinoforum.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
