import { getStrapiURL } from "./utils";

// Helper Fetcher Standar
async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  try {
    // Merge options
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Construct URL
    const requestUrl = path.startsWith("http")
      ? path
      : `${getStrapiURL("/api")}${path}`;

    // Fetch
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch API");
    }

    return data;
  } catch (error) {
    console.error("Fetch API Error:", error);
    // Lempar error agar bisa ditangani di komponen jika perlu,
    // atau return null di fungsi spesifik di bawah
    throw error;
  }
}

// --- BLOG POSTS ---

export async function getBlogPosts(featured = false) {
  const filters = featured ? "&filters[featured][$eq]=true" : "";
  const path = `/blog-posts?${filters}&populate[featuredImage][fields][0]=url&populate[featuredImage][fields][1]=formats&sort[0]=publishedDate:desc`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 60 }, // Cache update tiap 60 detik
      },
    );
    return data;
  } catch (error) {
    return { data: [] };
  }
}

export async function getBlogPost(slug) {
  const path = `/blog-posts?filters[slug][$eq]=${slug}&populate[featuredImage][fields][0]=url&populate[featuredImage][fields][1]=formats`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 60 },
      },
    );
    return data.data[0] || null;
  } catch (error) {
    return null;
  }
}

// --- PROJECTS ---

export async function getProjects(featured = false) {
  const filters = featured ? "&filters[featured][$eq]=true" : "";
  const path = `/projects?${filters}&populate[thumbnail][fields][0]=url&populate[thumbnail][fields][1]=formats&populate[logo][fields][0]=url&populate[logo][fields][1]=formats&populate[gallery][fields][0]=url&populate[gallery][fields][1]=formats&populate[testimonial][populate]=*&sort[0]=year:desc`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 3600 }, // Cache 1 jam
      },
    );
    return data;
  } catch (error) {
    return { data: [] };
  }
}

export async function getProject(slug) {
  const path = `/projects?filters[slug][$eq]=${slug}&populate[thumbnail][fields][0]=url&populate[thumbnail][fields][1]=formats&populate[logo][fields][0]=url&populate[logo][fields][1]=formats&populate[gallery][fields][0]=url&populate[gallery][fields][1]=formats&populate[testimonial][populate]=*`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 3600 },
      },
    );
    return data.data[0] || null;
  } catch (error) {
    return null;
  }
}

// --- TESTIMONIALS ---

export async function getTestimonials() {
  const path = `/testimonials?populate[avatar][fields][0]=url&populate[avatar][fields][1]=formats`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 3600 },
      },
    );
    return data;
  } catch (error) {
    return { data: [] };
  }
}
