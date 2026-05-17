import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.arduinoforum.com";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/categories", priority: "0.9", changefreq: "weekly" },
  { path: "/teams", priority: "0.8", changefreq: "weekly" },
  { path: "/leaderboard", priority: "0.8", changefreq: "daily" },
  { path: "/announcements", priority: "0.8", changefreq: "weekly" },
  { path: "/rules", priority: "0.6", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.4", changefreq: "monthly" },
  { path: "/cookies", priority: "0.4", changefreq: "monthly" },
];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();

  const [categories, posts] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.post.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const staticEntries = staticPages
    .map((p) => urlEntry(`${BASE_URL}${p.path}`, now, p.changefreq, p.priority))
    .join("\n");

  const categoryEntries = categories
    .map((cat) => urlEntry(`${BASE_URL}/categories/${cat.slug}`, now, "daily", "0.7"))
    .join("\n");

  const postEntries = posts
    .map((post) => urlEntry(`${BASE_URL}/posts/${post.id}`, post.createdAt.toISOString(), "weekly", "0.6"))
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${categoryEntries}
${postEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
