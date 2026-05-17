import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: { default: "Arduino Forum - Arduino Community", template: "%s | Arduino Forum" },
  description: "Arduino Forum is a community for Arduino enthusiasts. Get help with projects, share builds, form teams, and collaborate with makers worldwide.",
  keywords: ["arduino", "electronics", "microcontroller", "DIY", "maker", "community", "forum", "hardware", "programming", "robotics", "IoT"],
  authors: [{ name: "Arduino Forum Community" }],
  creator: "Arduino Forum",
  publisher: "Arduino Forum",
  metadataBase: new URL("https://www.arduinoforum.com"),
  alternates: {
    canonical: "https://www.arduinoforum.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.arduinoforum.com",
    siteName: "Arduino Forum",
    title: "Arduino Forum - Arduino Community",
    description: "Join the Arduino community. Get help with your projects, share your builds, and collaborate with makers worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@arduinoforum",
    title: "Arduino Forum - Arduino Community",
    description: "Join the Arduino community. Get help with your projects, share your builds, and collaborate with makers worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "WjYUYBQOdnzKHIi-xgEYfbX2pjd1syH_VIdxsQV1BoM",
  },
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
