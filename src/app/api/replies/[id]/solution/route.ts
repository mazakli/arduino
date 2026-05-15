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

    const { id: replyId } = await params;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: {
        post: true,
        author: { include: { team: true } },
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // Only post author can mark solution
    if (reply.post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the post author can mark a solution" },
        { status: 403 }
      );
    }

    // Toggle solution
    const isSolution = !reply.isSolution;

    await prisma.reply.update({
      where: { id: replyId },
      data: { isSolution },
    });

    // Mark post as solved
    await prisma.post.update({
      where: { id: reply.postId },
      data: { isSolved: isSolution },
    });

    // Award points to replier's team
    if (isSolution && reply.author?.teamId) {
      await prisma.team.update({
        where: { id: reply.author.teamId },
        data: { points: { increment: 1 } },
      });
    }

    return NextResponse.json({ isSolution });
  } catch (error) {
    console.error("POST /api/replies/[id]/solution error:", error);
    return NextResponse.json(
      { error: "Failed to mark solution" },
      { status: 500 }
    );
  }
}
