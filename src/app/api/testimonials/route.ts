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

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return errorResponse("Failed to fetch testimonials");
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        company,
        position,
        content,
        avatar,
        rating,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error creating testimonial:", error);
    return errorResponse("Failed to create testimonial");
  }
}
