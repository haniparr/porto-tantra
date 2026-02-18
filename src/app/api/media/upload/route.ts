import { NextRequest, NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/app/lib/auth-helpers";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with URL and metadata
 */
async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = "cms",
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, "cms");

    // We could save media metadata to DB here if needed, consistent with schema
    // For now, just return the URL to keep it simple for editor
    return NextResponse.json({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    return errorResponse("Failed to upload media");
  }
}
