import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Grid, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
    },
  });

  const categoryIcons: Record<string, string> = {
    general: "💬",
    hardware: "🔌",
    software: "💻",
    projects: "⭐",
    components: "📦",
    announcements: "📢",
    recruitment: "👥",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Grid className="w-5 h-5 text-[#00979D]" />
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      <div className="grid gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl">
                  {categoryIcons[cat.slug] || "📁"}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">{cat.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>{cat._count.posts} posts</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
