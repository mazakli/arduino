import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: { default: "Arduino Forum", template: "%s | Arduino Forum" },
  description: "The Arduino community forum - get help, share projects, build teams",
  keywords: ["arduino", "electronics", "microcontroller", "DIY", "maker", "community"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arduinoforum.com",
    siteName: "Arduino Forum",
    title: "Arduino Forum - Arduino Community",
    description:
      "Join the Arduino community. Get help with your projects, share your builds, and collaborate with makers worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arduino Forum",
    description: "The Arduino community forum",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50">
        <SessionProvider>
          <div className="flex h-full min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
