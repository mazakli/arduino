import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not your post" },
        { status: 403 }
      );
    }

    if (!post.certificateApproved) {
      return NextResponse.json(
        { error: "Post not approved for certificate" },
        { status: 403 }
      );
    }

    const certificate = await prisma.certificate.upsert({
      where: { postId },
      update: {},
      create: {
        userId: session.user.id,
        postId,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("POST /api/certificates error:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
