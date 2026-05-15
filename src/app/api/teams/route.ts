import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { points: "desc" },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, emoji } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        emoji: emoji || "🤖",
        members: {
          connect: { id: session.user.id },
        },
      },
    });

    // Update user's teamId
    await prisma.user.update({
      where: { id: session.user.id },
      data: { teamId: team.id },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
