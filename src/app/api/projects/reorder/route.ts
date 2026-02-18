import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  requireRole,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const { id, direction } = await request.json();

    if (!id || !["up", "down"].includes(direction)) {
      return errorResponse("Invalid request parameters", 400);
    }

    // 1. Get target project
    const targetProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!targetProject) {
      return errorResponse("Project not found", 404);
    }

    // 2. Find adjacent project based on direction and current sort (createdAt DESC)
    // Up = Newer date (so we look for project with < createdAt if we want to move UP in visual list?
    // Wait, visual list is DESC (Newest First).
    // So Top = Newest. Bottom = Oldest.
    // Move Up = Become Newer = Swap with project that has > createdAt (but closest to current)
    // Move Down = Become Older = Swap with project that has < createdAt (but closest to current)

    let adjacentProject;

    if (direction === "up") {
      // Find project created JUST AFTER this one (so we can swap to be that one)
      // Visual: [A (Today), B (Yesterday)]. We are B. We want to go Up to A's spot.
      // A has > createdAt.
      adjacentProject = await prisma.project.findFirst({
        where: {
          createdAt: {
            gt: targetProject.createdAt,
          },
        },
        orderBy: {
          createdAt: "asc", // Get the smallest date that is greater than ours (immediate neighbor above)
        },
      });
    } else {
      // Move Down = Swap with Older project
      // Find project created JUST BEFORE this one
      adjacentProject = await prisma.project.findFirst({
        where: {
          createdAt: {
            lt: targetProject.createdAt,
          },
        },
        orderBy: {
          createdAt: "desc", // Get the largest date that is smaller than ours (immediate neighbor below)
        },
      });
    }

    if (!adjacentProject) {
      return errorResponse(`Cannot move ${direction} further`, 400);
    }

    // 3. Swap createdAt dates
    // To avoid unique constraint issues or exact matches, we might need a buffer depending on DB,
    // but here we just swap exact timestamps.
    // NOTE: If timestamps are identical, this logic might fail.
    // Better to swap and add/subtract a second to ensure order.

    const targetDate = targetProject.createdAt;
    const adjacentDate = adjacentProject.createdAt;

    // Perform swap in transaction
    await prisma.$transaction([
      prisma.project.update({
        where: { id: targetProject.id },
        data: { createdAt: adjacentDate },
      }),
      prisma.project.update({
        where: { id: adjacentProject.id },
        data: { createdAt: targetDate },
      }),
    ]);

    // Revalidate frontend cache so homepage reflects new order immediately
    revalidatePath("/");
    revalidatePath("/work");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") return unauthorizedResponse();
    if (error.message === "Forbidden") return forbiddenResponse();
    console.error("Reorder error:", error);
    return errorResponse("Failed to reorder project");
  }
}
