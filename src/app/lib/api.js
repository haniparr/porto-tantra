import { getStrapiURL } from "./utils";

// Helper Fetcher with Timeout
async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    // Merge options with abort signal
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      signal: controller.signal,
    };

    // Construct URL
    const requestUrl = path.startsWith("http")
      ? path
      : `${getStrapiURL("/api")}${path}`;

    // Fetch with timeout
    const response = await fetch(requestUrl, mergedOptions);
    clearTimeout(timeoutId); // Clear timeout if request succeeds

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
        path: path,
      });
      throw new Error(
        data.error?.message || `Failed to fetch API: ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error

    // Handle timeout specifically
    if (error.name === "AbortError") {
      console.warn(`API request timeout after 5s: ${path}`);
      throw new Error("API request timeout");
    }

    console.error("Fetch API Error:", error);
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
    console.warn("getBlogPosts error:", error.message);
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
    console.warn("getBlogPost error:", error.message);
    return null;
  }
}

// --- PROJECTS ---

export async function getProjects(featured = false) {
  const filters = featured ? "&filters[featured][$eq]=true" : "";

  // Fixed: Populate sections with nested images
  const path = `/projects?${filters}&populate[thumbnail][fields][0]=url&populate[thumbnail][fields][1]=formats&populate[logo][fields][0]=url&populate[logo][fields][1]=formats&populate[sections][populate][images][fields][0]=url&populate[sections][populate][images][fields][1]=formats&populate[credits]=*&populate[testimonial][populate]=*&sort[0]=year:desc`;

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
    console.warn("getProjects error:", error.message);
    return { data: [] };
  }
}

export async function getProject(slug) {
  // ✅ FIXED: Ensure credits is populated
  const path = `/projects?filters[slug][$eq]=${slug}&populate[thumbnail][fields][0]=url&populate[thumbnail][fields][1]=formats&populate[logo][fields][0]=url&populate[logo][fields][1]=formats&populate[sections][populate][images][fields][0]=url&populate[sections][populate][images][fields][1]=formats&populate[credits][populate]=*&populate[testimonial][populate]=*`;

  try {
    const data = await fetchAPI(
      path,
      {},
      {
        next: { revalidate: 3600 },
      },
    );

    console.log("API Response for project:", data);
    if (data.data && data.data[0]) {
      console.log("Credits from API:", data.data[0].attributes.credits);
    }

    return data.data[0] || null;
  } catch (error) {
    console.warn("getProject error:", error.message);
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
    console.warn("getTestimonials error:", error.message);
    return { data: [] };
  }
}
