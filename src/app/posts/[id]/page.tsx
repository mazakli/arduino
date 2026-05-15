"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  ThumbsUp,
  CheckCircle,
  Award,
  MessageCircle,
  Tag,
} from "lucide-react";
import ReplyCard from "@/components/ReplyCard";
import ReplyForm from "@/components/ReplyForm";

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isSolution: boolean;
  isAiGenerated: boolean;
  author?: { id: string; username: string } | null;
  quotedReply?: {
    id: string;
    content: string;
    author?: { id: string; username: string } | null;
  } | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  upvotes: number;
  isSolved: boolean;
  isProject: boolean;
  certificateApproved: boolean;
  author?: { id: string; username: string } | null;
  category: { id: string; name: string; slug: string };
  replies: Reply[];
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [quotedReply, setQuotedReply] = useState<Reply | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        setUpvotes(data.upvotes);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleVotePost = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/posts/${id}/vote`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setHasVoted(data.voted);
        setUpvotes((prev) => (data.voted ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleSolutionToggle = async (replyId: string) => {
    try {
      const res = await fetch(`/api/replies/${replyId}/solution`, {
        method: "POST",
      });
      if (res.ok) {
        fetchPost();
      }
    } catch (error) {
      console.error("Failed to toggle solution:", error);
    }
  };

  const handleApproveForCertificate = async () => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateApproved: true }),
      });
      if (res.ok) {
        fetchPost();
      }
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">
            Post not found
          </h2>
          <Link href="/" className="text-[#00979D] mt-2 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = session?.user?.id === post.author?.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to discussions
      </Link>

      {/* Post */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Link
            href={`/categories/${post.category.slug}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-800"
          >
            <Tag className="w-3 h-3" />
            {post.category.name}
          </Link>
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

        <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span>by</span>
          <span className="font-medium text-gray-700">
            {post.author?.username || "Anonymous"}
          </span>
          <span>·</span>
          <span>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {post.imageUrl && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt="Post image"
              className="max-h-64 rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        {/* Post actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleVotePost}
            disabled={!session?.user?.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              hasVoted
                ? "bg-[#00979D] text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {upvotes} {upvotes === 1 ? "Upvote" : "Upvotes"}
          </button>

          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
          </span>

          {/* Certificate button for project authors */}
          {post.isProject && post.certificateApproved && isAuthor && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Award className="w-4 h-4" />
              View Certificate
            </Link>
          )}

          {/* Approve for certificate (moderator - for now any user can approve others') */}
          {post.isProject && !post.certificateApproved && session?.user?.id && !isAuthor && (
            <button
              onClick={handleApproveForCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Award className="w-4 h-4" />
              Approve for Certificate
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="space-y-3 mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
          </h2>
          {post.replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              postAuthorId={post.author?.id}
              onQuote={(r) => setQuotedReply(r)}
              onSolutionToggle={handleSolutionToggle}
            />
          ))}
        </div>
      )}

      {/* Reply form */}
      <ReplyForm
        postId={id}
        quotedReply={quotedReply}
        onReplyAdded={fetchPost}
        onClearQuote={() => setQuotedReply(null)}
      />
    </div>
  );
}
