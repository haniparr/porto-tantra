// Helper Base URL
export function getStrapiURL(path = "") {
  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// ✅ Helper Media URL dengan Default Fallback
export function getStrapiMedia(media, defaultImage = null) {
  // Return default if media is null, undefined, or empty
  if (!media) return defaultImage;

  // Handle berbagai struktur Strapi dengan null safety
  let url = null;

  try {
    // Check if media.data exists and has attributes
    if (media.data?.attributes?.url) {
      url = media.data.attributes.url;
    }
    // Check if media.attributes exists
    else if (media.attributes?.url) {
      url = media.attributes.url;
    }
    // Check if media itself has url property
    else if (typeof media === "object" && media.url) {
      url = media.url;
    }
  } catch (error) {
    console.warn("Error accessing media URL:", error);
    return defaultImage;
  }

  // If no URL found, return default
  if (!url) return defaultImage;

  // Return full URL
  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;
  return imageUrl;
}

// ✅ NEW: Helper khusus untuk mendapatkan image dengan fallback
export function getImageWithFallback(
  media,
  fallbackUrl = "https://placehold.co/800x600/1a1a1a/ffffff?text=No+Image",
) {
  return getStrapiMedia(media, fallbackUrl);
}
