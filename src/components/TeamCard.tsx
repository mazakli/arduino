import Link from "next/link";
import { Users, Trophy } from "lucide-react";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    points: number;
    _count: { members: number };
  };
  rank?: number;
}

export default function TeamCard({ team, rank }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-3">
          {rank !== undefined && (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                rank === 1
                  ? "bg-yellow-100 text-yellow-700"
                  : rank === 2
                  ? "bg-gray-100 text-gray-600"
                  : rank === 3
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {rank}
            </div>
          )}
          <div className="text-3xl flex-shrink-0">{team.emoji}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{team.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {team.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {team._count.members} members
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            {team.points} points
          </span>
        </div>
      </div>
    </Link>
  );
}
