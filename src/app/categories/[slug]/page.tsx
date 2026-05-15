import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          author: { select: { id: true, username: true } },
          category: true,
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

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
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        All categories
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{categoryIcons[category.slug] || "📁"}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {category.posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No posts in this category yet.</p>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Be the first to post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {category.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                createdAt: post.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
