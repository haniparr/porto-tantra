import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  requireRole,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return errorResponse("Blog post not found", 404);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return errorResponse("Failed to fetch blog post");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);
    const { id } = await params;

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

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingPost) {
        return errorResponse("Slug already exists", 400);
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        category,
        tags,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        readTime,
        featured,
        published,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error updating blog post:", error);
    return errorResponse("Failed to update blog post");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error deleting blog post:", error);
    return errorResponse("Failed to delete blog post");
  }
}
