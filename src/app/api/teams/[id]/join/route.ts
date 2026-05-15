import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Leave current team if any
    if (user?.teamId && user.teamId !== teamId) {
      await prisma.team.update({
        where: { id: user.teamId },
        data: {
          members: { disconnect: { id: session.user.id } },
        },
      });
    }

    // Join new team
    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: { connect: { id: session.user.id } },
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { teamId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/teams/[id]/join error:", error);
    return NextResponse.json(
      { error: "Failed to join team" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: { disconnect: { id: session.user.id } },
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { teamId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/teams/[id]/join error:", error);
    return NextResponse.json(
      { error: "Failed to leave team" },
      { status: 500 }
    );
  }
}
