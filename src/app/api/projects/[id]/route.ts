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
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        sections: { orderBy: { order: "asc" } },
        credits: true,
        testimonial: true,
      },
    });

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return errorResponse("Failed to fetch project");
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await requireRole(["ADMIN", "EDITOR"]);

    const body = await request.json();
    const {
      client,
      slug,
      year,
      services,
      thumbnail,
      logo,
      featured,
      published,
      createdAt, // ✅ Allow updating creation date
      sections,
      credits,
      testimonialId,
    } = body;

    // ... existing slug check ...

    // Delete existing sections and credits, then recreate them
    await prisma.projectSection.deleteMany({
      where: { projectId: params.id },
    });

    await prisma.projectCredit.deleteMany({
      where: { projectId: params.id },
    });

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        client,
        slug,
        year,
        services,
        thumbnail,
        logo,
        featured,
        published,
        createdAt: createdAt ? new Date(createdAt) : undefined, // ✅ Update createdAt if provided
        testimonialId: testimonialId || null,
        sections: {
          create:
            sections?.map((section: any, index: number) => ({
              title: section.title,
              description: section.description,
              images: section.images || [],
              order: index,
            })) || [],
        },
        credits: {
          create:
            credits?.map((credit: any) => ({
              name: credit.name,
              role: credit.role,
            })) || [],
        },
      },
      include: {
        sections: true,
        credits: true,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error updating project:", error);
    return errorResponse("Failed to update project");
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await requireRole(["ADMIN"]);

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error deleting project:", error);
    return errorResponse("Failed to delete project");
  }
}
