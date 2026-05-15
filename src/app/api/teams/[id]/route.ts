import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            _count: {
              select: {
                replies: { where: { isSolution: true } },
                posts: { where: { isProject: true } },
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Count projects
    const projectsCount = await prisma.post.count({
      where: {
        isProject: true,
        author: { teamId: id },
      },
    });

    return NextResponse.json({ ...team, projectsCount });
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}
