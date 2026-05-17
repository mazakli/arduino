import { NextResponse } from "next/server";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /profile",
    "Disallow: /posts/new",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "Sitemap: https://www.arduinoforum.com/sitemap.xml",
  ].join("\n");

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
