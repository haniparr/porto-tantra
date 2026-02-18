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
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial) {
      return errorResponse("Testimonial not found", 404);
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return errorResponse("Failed to fetch testimonial");
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
      clientName,
      company,
      position,
      content,
      avatar,
      rating,
      published,
    } = body;

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        clientName,
        company,
        position,
        content,
        avatar,
        rating,
        published,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error updating testimonial:", error);
    return errorResponse("Failed to update testimonial");
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await requireRole(["ADMIN"]);

    await prisma.testimonial.delete({
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
    console.error("Error deleting testimonial:", error);
    return errorResponse("Failed to delete testimonial");
  }
}
