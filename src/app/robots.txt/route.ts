import { NextResponse } from "next/server";

export function GET() {
  const body = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /profile\nSitemap: https://arduinoforum.com/sitemap.xml`;
  return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
}
