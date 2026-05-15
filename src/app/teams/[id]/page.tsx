"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Trophy, Star, UserPlus, LogOut } from "lucide-react";

interface Member {
  id: string;
  username: string;
  createdAt: string;
  _count: {
    replies: number;
    posts: number;
  };
}

interface TeamDetail {
  id: string;
  name: string;
  description: string;
  emoji: string;
  points: number;
  members: Member[];
  projectsCount: number;
  _count: { members: number };
}

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [teamRes, profileRes] = await Promise.all([
        fetch(`/api/teams/${id}`),
        session?.user?.id ? fetch("/api/profile") : Promise.resolve(null),
      ]);

      if (teamRes.ok) {
        setTeam(await teamRes.json());
      }

      if (profileRes?.ok) {
        const profile = await profileRes.json();
        setUserTeamId(profile.teamId);
      }
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setLoading(false);
    }
  }, [id, session?.user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleJoin = async () => {
    if (!session?.user?.id) return;
    setJoining(true);
    try {
      const res = await fetch(`/api/teams/${id}/join`, { method: "POST" });
      if (res.ok) {
        setUserTeamId(id);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to join:", error);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!session?.user?.id) return;
    setJoining(true);
    try {
      const res = await fetch(`/api/teams/${id}/join`, { method: "DELETE" });
      if (res.ok) {
        setUserTeamId(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to leave:", error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">Team not found</h2>
          <Link href="/teams" className="text-[#00979D] mt-2 inline-block">
            Back to teams
          </Link>
        </div>
      </div>
    );
  }

  const isMember = userTeamId === id;
  const topContributors = [...team.members]
    .sort((a, b) => b._count.replies - a._count.replies)
    .slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        All teams
      </Link>

      {/* Team header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{team.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{team.description}</p>
            </div>
          </div>

          {session?.user && (
            <div>
              {isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={joining}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {joining ? "..." : "Leave"}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80] transition-colors disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  {joining ? "..." : "Join Team"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              <Trophy className="w-5 h-5 text-amber-500" />
              {team.points}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total Points</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              <Users className="w-5 h-5 text-blue-500" />
              {team._count.members}
            </div>
            <div className="text-xs text-gray-500 mt-1">Members</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              <Star className="w-5 h-5 text-green-500" />
              {team.projectsCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Projects</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top contributors */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Top Contributors</h2>
          {topContributors.length === 0 ? (
            <p className="text-sm text-gray-500">No contributors yet</p>
          ) : (
            <div className="space-y-2">
              {topContributors.map((member, i) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-5 text-gray-400 font-medium">{i + 1}.</span>
                  <div className="w-7 h-7 bg-[#00979D] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {member.username[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700 flex-1">{member.username}</span>
                  <span className="text-gray-400 text-xs">
                    {member._count.replies} solutions
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">
            Members ({team._count.members})
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                  {member.username[0].toUpperCase()}
                </div>
                <span className="text-gray-700">{member.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
