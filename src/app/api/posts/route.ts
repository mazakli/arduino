import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAiReply, stripUrls } from "@/lib/ai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = categorySlug
      ? { category: { slug: categorySlug } }
      : undefined;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, username: true } },
          category: true,
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { title, content, categoryId, imageUrl } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const isAnonymous = !session?.user?.id;
    const processedContent = isAnonymous ? stripUrls(content) : content;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    const isProject = category?.slug === "projects";

    const post = await prisma.post.create({
      data: {
        title,
        content: processedContent,
        categoryId,
        imageUrl: imageUrl || null,
        authorId: session?.user?.id || null,
        isProject,
      },
      include: {
        author: { select: { id: true, username: true } },
        category: true,
      },
    });

    // Generate AI reply asynchronously
    generateAiReply(title, processedContent)
      .then(async (aiContent) => {
        await prisma.reply.create({
          data: {
            content: aiContent,
            postId: post.id,
            authorId: null,
            isAiGenerated: true,
          },
        });
      })
      .catch(console.error);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
