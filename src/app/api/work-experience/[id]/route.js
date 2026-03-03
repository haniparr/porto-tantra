import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth-helpers";
import { z } from "zod";

const updateExperienceSchema = z.object({
  company: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(255).optional(),
  year: z.string().min(1).max(50).optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.string().url().nullable().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export async function PUT(req, { params }) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const { id } = await params;
    const body = await req.json();
    const data = updateExperienceSchema.parse(body);

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        year: data.year,
        achievements: data.achievements,
        logo: data.logo,
        order: data.order,
        published: data.published,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update work experience" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole(["ADMIN"]);

    const { id } = await params;

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Work experience deleted successfully",
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to delete work experience" },
      { status: 500 },
    );
  }
}
