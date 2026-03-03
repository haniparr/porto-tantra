import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth-helpers";
import { z } from "zod";

const createExperienceSchema = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  year: z.string().min(1).max(50),
  achievements: z.array(z.string()).optional(),
  logo: z.string().url().nullable().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch work experiences" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const body = await req.json();
    const data = createExperienceSchema.parse(body);

    const experience = await prisma.workExperience.create({
      data: {
        company: data.company,
        role: data.role,
        year: data.year,
        achievements: data.achievements,
        logo: data.logo || null,
        order: data.order || 0,
        published: data.published ?? true,
      },
    });

    return NextResponse.json(experience, { status: 201 });
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
      { error: "Failed to create work experience" },
      { status: 500 },
    );
  }
}
