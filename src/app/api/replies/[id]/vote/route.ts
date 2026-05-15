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
      return NextResponse.json(
        { error: "Must be logged in to vote" },
        { status: 401 }
      );
    }

    const { id: replyId } = await params;

    const reply = await prisma.reply.findUnique({ where: { id: replyId } });
    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_replyId: {
          userId: session.user.id,
          replyId,
        },
      },
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.vote.delete({ where: { id: existingVote.id } });
      await prisma.reply.update({
        where: { id: replyId },
        data: { upvotes: { decrement: 1 } },
      });
      return NextResponse.json({ voted: false });
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          replyId,
        },
      });
      await prisma.reply.update({
        where: { id: replyId },
        data: { upvotes: { increment: 1 } },
      });
      return NextResponse.json({ voted: true });
    }
  } catch (error) {
    console.error("POST /api/replies/[id]/vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
