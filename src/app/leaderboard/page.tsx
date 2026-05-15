import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Trophy, Users, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const teams = await prisma.team.findMany({
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { points: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-[#00979D]" />
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Team</div>
            <div className="col-span-2 text-center">Members</div>
            <div className="col-span-3 text-right">Points</div>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No teams yet.</p>
            <Link href="/teams" className="text-[#00979D] text-sm mt-1 block">
              Create or join a team
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {teams.map((team, index) => (
              <Link key={team.id} href={`/teams/${team.id}`}>
                <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="col-span-1">
                    {index === 0 ? (
                      <span className="text-yellow-500 font-bold text-lg">🥇</span>
                    ) : index === 1 ? (
                      <span className="text-gray-400 font-bold text-lg">🥈</span>
                    ) : index === 2 ? (
                      <span className="text-amber-600 font-bold text-lg">🥉</span>
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="col-span-6 flex items-center gap-3">
                    <span className="text-2xl">{team.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {team.description}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    {team._count.members}
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-gray-900">{team.points}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
