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
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse("Invalid IDs provided", 400);
    }

    await prisma.blogPost.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error bulk deleting blog posts:", error);
    return errorResponse("Failed to delete blog posts");
  }
}
