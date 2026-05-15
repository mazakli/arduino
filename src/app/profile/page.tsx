"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { User, MessageCircle, FileText, Award, Users } from "lucide-react";

interface Certificate {
  id: string;
  uniqueCode: string;
  issuedAt: string;
  post: { id: string; title: string };
}

interface Profile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  team: { id: string; name: string; emoji: string } | null;
  posts: Array<{
    id: string;
    title: string;
    createdAt: string;
    category: { name: string };
  }>;
  certificates: Certificate[];
  _count: { posts: number; replies: number };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Sign in to view your profile
        </h2>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-[#00979D] text-white text-sm font-medium rounded-lg hover:bg-[#007A80]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-[#00979D]" />
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#00979D] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since{" "}
              {formatDistanceToNow(new Date(profile.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {profile._count.posts}
            </div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {profile._count.replies}
            </div>
            <div className="text-xs text-gray-500">Replies</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {profile.certificates.length}
            </div>
            <div className="text-xs text-gray-500">Certificates</div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Team</h3>
        </div>
        {profile.team ? (
          <Link href={`/teams/${profile.team.id}`}>
            <div className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
              <span className="text-2xl">{profile.team.emoji}</span>
              <span className="font-medium text-gray-800">{profile.team.name}</span>
            </div>
          </Link>
        ) : (
          <div className="text-sm text-gray-500">
            Not in a team yet.{" "}
            <Link href="/teams" className="text-[#00979D] hover:underline">
              Browse teams
            </Link>
          </div>
        )}
      </div>

      {/* Certificates */}
      {profile.certificates.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-gray-900">Certificates</h3>
          </div>
          <div className="space-y-2">
            {profile.certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm text-gray-700 truncate">
                  {cert.post.title}
                </span>
                <Link
                  href={`/certificates/${cert.uniqueCode}`}
                  target="_blank"
                  className="text-xs text-[#00979D] hover:underline flex-shrink-0"
                >
                  View Certificate
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent posts */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Recent Posts</h3>
        </div>
        {profile.posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-2">
            {profile.posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="flex items-center justify-between gap-2 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
