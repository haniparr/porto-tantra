// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  unauthorizedResponse,
  errorResponse,
} from "@/app/lib/auth-helpers";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

// Increase timeout and body size limit for file uploads
export const maxDuration = 60; // 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Invalid file type. Only images are allowed.", 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 10MB.", 400);
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Upload error:", error);
    return errorResponse("Failed to upload file", 500);
  }
}
