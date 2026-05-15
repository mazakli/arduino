"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, CheckCircle, Quote, Bot } from "lucide-react";

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

interface ReplyCardProps {
  reply: Reply;
  postAuthorId?: string | null;
  onQuote: (reply: Reply) => void;
  onSolutionToggle: (replyId: string) => void;
}

export default function ReplyCard({
  reply,
  postAuthorId,
  onQuote,
  onSolutionToggle,
}: ReplyCardProps) {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(reply.upvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isMarkingSolution, setIsMarkingSolution] = useState(false);

  const handleVote = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/replies/${reply.id}/vote`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setHasVoted(data.voted);
        setUpvotes((prev) => (data.voted ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleMarkSolution = async () => {
    if (isMarkingSolution) return;
    setIsMarkingSolution(true);
    try {
      onSolutionToggle(reply.id);
    } finally {
      setIsMarkingSolution(false);
    }
  };

  const isPostAuthor = session?.user?.id === postAuthorId;

  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        reply.isSolution ? "border-green-300 bg-green-50" : "border-gray-200"
      }`}
    >
      {/* Quoted reply */}
      {reply.quotedReply && (
        <div className="mb-3 pl-3 border-l-4 border-[#00979D] bg-gray-50 rounded-r-lg py-2 pr-2">
          <p className="text-xs text-gray-500 mb-1">
            Quoting{" "}
            <span className="font-medium">
              {reply.quotedReply.author?.username || "Anonymous"}
            </span>
            :
          </p>
          <p className="text-sm text-gray-600 line-clamp-3">
            {reply.quotedReply.content}
          </p>
        </div>
      )}

      {/* AI badge */}
      {reply.isAiGenerated && (
        <div className="flex items-center gap-1 mb-2 text-xs text-purple-600">
          <Bot className="w-3.5 h-3.5" />
          <span className="font-medium">AI Assistant Response</span>
        </div>
      )}

      {/* Content */}
      <div className="text-sm text-gray-800 whitespace-pre-wrap">
        {reply.content}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {reply.isAiGenerated ? (
              <span className="text-purple-500 font-medium">Arduino AI</span>
            ) : (
              <span className="font-medium text-gray-700">
                {reply.author?.username || "Anonymous"}
              </span>
            )}
          </span>
          <span>·</span>
          <span>
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Vote button */}
          <button
            onClick={handleVote}
            disabled={!session?.user?.id}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
              hasVoted
                ? "bg-[#00979D] text-white"
                : "text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {upvotes}
          </button>

          {/* Quote button */}
          <button
            onClick={() => onQuote(reply)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
            Quote
          </button>

          {/* Mark as solution button */}
          {isPostAuthor && !reply.isAiGenerated && (
            <button
              onClick={handleMarkSolution}
              disabled={isMarkingSolution}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
                reply.isSolution
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {reply.isSolution ? "Solution" : "Mark Solution"}
            </button>
          )}

          {reply.isSolution && !isPostAuthor && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              Solution
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
