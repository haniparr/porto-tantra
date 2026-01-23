// Helper Base URL
export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  }${path}`;
}

// Helper Media URL (PENTING untuk Next/Image)
export function getStrapiMedia(media) {
  if (!media) return null;

  // Handle nesting Strapi
  const { url } = media.data?.attributes || media.attributes || media;

  if (!url) return null;

  // Return full URL
  const imageUrl = url.startsWith("/") ? getStrapiURL(url) : url;

  return imageUrl;
}
