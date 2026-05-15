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

    const { id: postId } = await params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.vote.delete({ where: { id: existingVote.id } });
      await prisma.post.update({
        where: { id: postId },
        data: { upvotes: { decrement: 1 } },
      });
      return NextResponse.json({ voted: false });
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { upvotes: { increment: 1 } },
      });

      // Check if post is a project with 5+ upvotes - auto-approve certificate
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
      });
      if (
        updatedPost?.isProject &&
        updatedPost.upvotes >= 5 &&
        !updatedPost.certificateApproved &&
        updatedPost.authorId
      ) {
        await prisma.post.update({
          where: { id: postId },
          data: { certificateApproved: true },
        });
        await prisma.certificate.upsert({
          where: { postId },
          update: {},
          create: {
            userId: updatedPost.authorId,
            postId,
          },
        });
      }

      return NextResponse.json({ voted: true });
    }
  } catch (error) {
    console.error("POST /api/posts/[id]/vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
