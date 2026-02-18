import { NextRequest, NextResponse } from "next/server";
import {
  requireRole,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);

    const body = await request.json();
    const { data } = body;

    if (!data || !data.blogPosts || !data.projects || !data.testimonials) {
      return errorResponse("Invalid import data format", 400);
    }

    // Import in transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing data (optional - be careful!)
      // await tx.blogPost.deleteMany();
      // await tx.project.deleteMany();
      // await tx.testimonial.deleteMany();

      // Import blog posts
      for (const post of data.blogPosts) {
        await tx.blogPost.upsert({
          where: { slug: post.slug },
          update: post,
          create: post,
        });
      }

      // Import testimonials first (referenced by projects)
      for (const testimonial of data.testimonials) {
        await tx.testimonial.upsert({
          where: { id: testimonial.id },
          update: testimonial,
          create: testimonial,
        });
      }

      // Import projects with sections and credits
      for (const project of data.projects) {
        const { sections, credits, ...projectData } = project;

        await tx.project.upsert({
          where: { slug: project.slug },
          update: projectData,
          create: projectData,
        });

        // Delete and recreate sections
        await tx.projectSection.deleteMany({
          where: { projectId: project.id },
        });

        if (sections && sections.length > 0) {
          await tx.projectSection.createMany({
            data: sections,
          });
        }

        // Delete and recreate credits
        await tx.projectCredit.deleteMany({
          where: { projectId: project.id },
        });

        if (credits && credits.length > 0) {
          await tx.projectCredit.createMany({
            data: credits,
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Data imported successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error importing data:", error);
    return errorResponse("Failed to import data");
  }
}
