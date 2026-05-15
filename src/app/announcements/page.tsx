import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Megaphone, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const category = await prisma.category.findUnique({
    where: { slug: "announcements" },
  });

  const posts = category
    ? await prisma.post.findMany({
        where: { categoryId: category.id },
        include: {
          author: { select: { id: true, username: true } },
          category: true,
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#00979D]" />
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, createdAt: post.createdAt.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
