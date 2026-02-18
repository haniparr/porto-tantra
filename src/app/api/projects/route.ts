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
    const published = searchParams.get("published");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { client: { contains: search, mode: "insensitive" } },
        { services: { contains: search, mode: "insensitive" } },
      ];
    }

    if (published !== null && published !== "") {
      where.published = published === "true";
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sections: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              images: true, // ✅ Include section images
              order: true,
              projectId: true,
            },
          },
          credits: true,
          testimonial: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return errorResponse("Failed to fetch projects");
  }
}

export async function POST(request: NextRequest) {
  try {
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
      sections,
      credits,
      testimonialId,
    } = body;

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return errorResponse("Slug already exists", 400);
    }

    const project = await prisma.project.create({
      data: {
        client,
        slug,
        year,
        services,
        thumbnail,
        logo,
        featured: featured || false,
        published: published || false,
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

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error creating project:", error);
    return errorResponse("Failed to create project");
  }
}
