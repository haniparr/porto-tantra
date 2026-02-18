import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    // Blog Posts Stats
    const blogPosts = await prisma.blogPost.findMany({
      select: { published: true },
    });
    const blogStats = {
      total: blogPosts.length,
      published: blogPosts.filter((p) => p.published === true).length,
      draft: blogPosts.filter((p) => p.published === false).length,
    };

    // Projects Stats
    const projects = await prisma.project.findMany({
      select: { published: true },
    });
    const projectStats = {
      total: projects.length,
      published: projects.filter((p) => p.published === true).length,
      draft: projects.filter((p) => p.published === false).length,
    };

    // Testimonials Stats
    const testimonialsCount = await prisma.testimonial.count();

    // Users Stats
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      blogPosts: blogStats,
      projects: projectStats,
      testimonials: { total: testimonialsCount },
      users: { total: usersCount },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
