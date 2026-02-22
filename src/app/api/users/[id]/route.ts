import { NextRequest, NextResponse } from "next/server";
import {
  requireRole,
  getCurrentUser,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);

    // We don't strictly need to await params in older versions but in latest it's a good idea,
    // although I'll just check if it's already an object. In recent Next.js 15, params is a Promise.
    // I'll be safe and mirror the PUT method.
    const unwrappedParams = await params;
    const { id } = unwrappedParams;

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error fetching user:", error);
    return errorResponse("Failed to fetch user");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await params;

    const body = await request.json();
    const { name, email, role, password } = body;

    const updateData: any = { name, email, role };

    if (password) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error updating user:", error);
    return errorResponse("Failed to update user");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireRole(["ADMIN"]);
    const { id } = await params;

    // Prevent deleting yourself
    if (currentUser.id === id) {
      return errorResponse("Cannot delete your own account", 400);
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error.message === "Forbidden") {
      return forbiddenResponse();
    }
    console.error("Error deleting user:", error);
    return errorResponse("Failed to delete user");
  }
}
