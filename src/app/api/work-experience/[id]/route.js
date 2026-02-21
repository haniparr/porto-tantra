import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        year: data.year,
        achievements: data.achievements,
        order: data.order,
        published: data.published,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Failed to update work experience" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Work experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return NextResponse.json(
      { error: "Failed to delete work experience" },
      { status: 500 },
    );
  }
}
