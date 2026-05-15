import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, CheckCircle, Tag } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    upvotes: number;
    isSolved: boolean;
    isProject: boolean;
    author?: { id: string; username: string } | null;
    category: { id: string; name: string; slug: string };
    _count: { replies: number };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const categoryColors: Record<string, string> = {
    general: "bg-blue-100 text-blue-800",
    hardware: "bg-orange-100 text-orange-800",
    software: "bg-purple-100 text-purple-800",
    projects: "bg-green-100 text-green-800",
    components: "bg-yellow-100 text-yellow-800",
    announcements: "bg-red-100 text-red-800",
    recruitment: "bg-teal-100 text-teal-800",
  };

  const colorClass =
    categoryColors[post.category.slug] || "bg-gray-100 text-gray-800";

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}
              >
                <Tag className="w-3 h-3" />
                {post.category.name}
              </span>
              {post.isSolved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3" />
                  Solved
                </span>
              )}
              {post.isProject && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                  Project
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {post.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {post._count.replies}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>by</span>
            <span className="font-medium text-gray-700">
              {post.author?.username || "Anonymous"}
            </span>
            <span>·</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
