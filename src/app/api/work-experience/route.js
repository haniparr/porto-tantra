import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch work experiences", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

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
    console.error("Error creating work experience:", error);
    return NextResponse.json(
      { error: "Failed to create work experience" },
      { status: 500 },
    );
  }
}
