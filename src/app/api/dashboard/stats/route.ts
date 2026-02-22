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

    // Clients Stats
    const clients = await prisma.client.findMany({
      select: { published: true },
    });
    const clientStats = {
      total: clients.length,
      published: clients.filter((c) => c.published === true).length,
      draft: clients.filter((c) => c.published === false).length,
    };

    // Work Experience Stats
    const workExperiences = await prisma.workExperience.findMany({
      select: { published: true },
    });
    const workExperienceStats = {
      total: workExperiences.length,
      published: workExperiences.filter((w) => w.published === true).length,
      draft: workExperiences.filter((w) => w.published === false).length,
    };

    return NextResponse.json({
      blogPosts: blogStats,
      projects: projectStats,
      testimonials: { total: testimonialsCount },
      clients: clientStats,
      workExperiences: workExperienceStats,
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
