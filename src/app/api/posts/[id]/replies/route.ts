import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripUrls } from "@/lib/ai";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { content, quotedReplyId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isAnonymous = !session?.user?.id;
    const processedContent = isAnonymous ? stripUrls(content) : content;

    const reply = await prisma.reply.create({
      data: {
        content: processedContent,
        postId,
        authorId: session?.user?.id || null,
        quotedReplyId: quotedReplyId || null,
      },
      include: {
        author: { select: { id: true, username: true } },
        quotedReply: {
          include: {
            author: { select: { id: true, username: true } },
          },
        },
      },
    });

    // Create notification for post author if they have an account
    if (post.authorId && post.authorId !== session?.user?.id) {
      const replierName = session?.user?.name || "Anonymous";
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          message: `${replierName} replied to your post "${post.title}"`,
          postId,
        },
      });

      // Increment notification count
      await prisma.user.update({
        where: { id: post.authorId },
        data: { notificationsCount: { increment: 1 } },
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts/[id]/replies error:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
