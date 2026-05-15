import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        category: true,
        replies: {
          include: {
            author: { select: { id: true, username: true } },
            quotedReply: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { replies: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { certificateApproved } = body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { certificateApproved },
    });

    // If approved, create certificate if not exists
    if (certificateApproved && post.authorId) {
      await prisma.certificate.upsert({
        where: { postId: id },
        update: {},
        create: {
          userId: post.authorId,
          postId: id,
        },
      });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
