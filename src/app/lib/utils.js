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
  if (!media) return defaultImage;

  // Handle berbagai struktur Strapi
  const { url } = media.data?.attributes || media.attributes || media;

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
