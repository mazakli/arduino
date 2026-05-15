import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } },
        category: true,
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Discussions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the conversation with Arduino enthusiasts worldwide
          </p>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Categories quick filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/"
          className="px-3 py-1.5 text-xs font-medium bg-[#00979D] text-white rounded-full"
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full hover:border-[#00979D] hover:text-[#00979D] transition-colors"
          >
            {cat.name}
            <span className="ml-1 text-gray-400">({cat._count.posts})</span>
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-lg font-semibold text-gray-700">
            No posts yet!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Be the first to start a discussion.
          </p>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
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
