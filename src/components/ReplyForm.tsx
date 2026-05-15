"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, X } from "lucide-react";

interface QuotedReply {
  id: string;
  content: string;
  author?: { id: string; username: string } | null;
}

interface ReplyFormProps {
  postId: string;
  quotedReply: QuotedReply | null;
  onReplyAdded: () => void;
  onClearQuote: () => void;
}

export default function ReplyForm({
  postId,
  quotedReply,
  onReplyAdded,
  onClearQuote,
}: ReplyFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          quotedReplyId: quotedReply?.id || null,
        }),
      });

      if (res.ok) {
        setContent("");
        onClearQuote();
        onReplyAdded();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post reply");
      }
    } catch {
      setError("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">
        {session?.user ? `Reply as ${session.user.name}` : "Reply anonymously"}
      </h3>

      {!session?.user && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
          You are posting anonymously. URLs will be removed from your reply.
          <a href="/login" className="ml-1 underline">
            Login
          </a>{" "}
          for full features.
        </p>
      )}

      {/* Quoted reply preview */}
      {quotedReply && (
        <div className="mb-3 flex items-start gap-2">
          <div className="flex-1 pl-3 border-l-4 border-[#00979D] bg-gray-50 rounded-r-lg py-2 pr-2">
            <p className="text-xs text-gray-500 mb-1">
              Quoting{" "}
              <span className="font-medium">
                {quotedReply.author?.username || "Anonymous"}
              </span>
              :
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {quotedReply.content}
            </p>
          </div>
          <button
            onClick={onClearQuote}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Remove quote"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] focus:border-transparent resize-none"
          required
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
