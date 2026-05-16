import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://arduinoforum.com";

const staticPages = [
  "/",
  "/categories",
  "/teams",
  "/leaderboard",
  "/announcements",
  "/rules",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
];

export async function GET() {
  const now = new Date().toISOString();

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const staticEntries = staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("");

  const categoryEntries = categories
    .map(
      (cat) => `
  <url>
    <loc>${BASE_URL}/categories/${cat.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${categoryEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
