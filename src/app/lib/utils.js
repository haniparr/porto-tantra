// Helper: Extract image URL from various media object formats
// (backward-compatible with old Strapi-like structure from API transform layer)
export function getStrapiMedia(media, defaultImage = null) {
  if (!media) return defaultImage;

  let url = null;

  try {
    if (media.data?.attributes?.url) {
      url = media.data.attributes.url;
    } else if (media.attributes?.url) {
      url = media.attributes.url;
    } else if (typeof media === "object" && media.url) {
      url = media.url;
    }
  } catch {
    return defaultImage;
  }

  if (!url) return defaultImage;

  // All images should be full URLs (Cloudinary, Unsplash, etc.)
  // Relative paths are no longer supported (legacy Strapi removed)
  if (url.startsWith("/")) return defaultImage;

  return url;
}

// Helper: Get image URL with a placeholder fallback
export function getImageWithFallback(
  media,
  fallbackUrl = "https://placehold.co/800x600/1a1a1a/ffffff?text=No+Image",
) {
  return getStrapiMedia(media, fallbackUrl);
}
