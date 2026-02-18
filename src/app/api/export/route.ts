import { NextRequest, NextResponse } from "next/server";
import {
  requireRole,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);

    const [blogPosts, projects, testimonials, users] = await Promise.all([
      prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          category: true,
          tags: true,
          publishedDate: true,
          readTime: true,
          featured: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.findMany({
        include: {
          sections: { orderBy: { order: "asc" } },
          credits: true,
        },
      }),
      prisma.testimonial.findMany(),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      data: {
        blogPosts,
        projects,
        testimonials,
        users,
      },
    };

    return NextResponse.json(exportData);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error exporting data:", error);
    return errorResponse("Failed to export data");
  }
}
