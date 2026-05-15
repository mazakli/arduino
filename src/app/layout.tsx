import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Arduino Forum",
  description: "The Arduino community forum - discuss projects, get help, and share your builds",
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
            <main className="flex-1 min-w-0 overflow-y-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
