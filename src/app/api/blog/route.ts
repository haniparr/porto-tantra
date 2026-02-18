import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  requireRole,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (published !== null && published !== "") {
      where.published = published === "true";
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return errorResponse("Failed to fetch blog posts");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      publishedDate,
      readTime,
      featured,
      published,
    } = body;

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return errorResponse("Slug already exists", 400);
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags: tags || [],
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        readTime,
        featured: featured || false,
        published: published || false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error creating blog post:", error);
    return errorResponse("Failed to create blog post");
  }
}
