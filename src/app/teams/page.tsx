"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TeamCard from "@/components/TeamCard";
import { Users, PlusCircle } from "lucide-react";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  description: string;
  emoji: string;
  points: number;
  _count: { members: number };
}

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🤖");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then(setTeams)
      .catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, emoji }),
      });
      const data = await res.json();
      if (res.ok) {
        const refreshed = await fetch("/api/teams").then((r) => r.json());
        setTeams(refreshed);
        setShowCreate(false);
        setName("");
        setDescription("");
        setEmoji("🤖");
      } else {
        setError(data.error || "Failed to create team");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00979D]" />
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        </div>
        {session?.user && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Team
          </button>
        )}
      </div>

      {!session?.user && (
        <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-3 text-sm mb-4">
          <Link href="/login" className="underline font-medium">Login</Link> to create or join a team.
        </div>
      )}

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Create a New Team</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="flex gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-16 px-2 py-2 text-xl border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] text-center"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arduino Builders"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is your team about?"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00979D] resize-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No teams yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
