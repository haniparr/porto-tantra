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
    await requireRole(["ADMIN", "EDITOR"]);

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse("Invalid or missing 'ids' array", 400);
    }

    const result = await prisma.project.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      message: "Projects deleted successfully",
      count: result.count,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error bulk deleting projects:", error);
    return errorResponse("Failed to delete projects");
  }
}
