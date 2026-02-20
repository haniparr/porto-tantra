// API client for fetching data from internal Next.js API routes
// Updated to use Prisma-backed API instead of Strapi

// Helper Fetcher with Timeout
async function fetchAPI(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      signal: controller.signal,
    };

    // Build absolute URL for both client and server-side rendering
    // In server components, we need absolute URLs
    let requestUrl;

    if (typeof window === "undefined") {
      // Server-side: build absolute URL using env vars (priority order)
      let baseUrl;
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        baseUrl = "http://localhost:3000";
      }
      requestUrl = `${baseUrl}${path}`;
    } else {
      // Client-side: can use relative URLs
      requestUrl = path;
    }

    const response = await fetch(requestUrl, mergedOptions);
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch API: ${response.status}`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.warn(`API request timeout after 10s: ${path}`);
      throw new Error("API request timeout");
    }

    throw error;
  }
}

// --- BLOG POSTS ---

export async function getBlogPosts(featured = false) {
  const params = new URLSearchParams({
    published: "true",
    limit: "100",
  });

  if (featured) params.append("featured", "true");

  const path = `/api/blog?${params.toString()}`;

  try {
    const data = await fetchAPI(path, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    // Transform to Strapi-like format for compatibility
    const transformedPosts = (data.posts || []).map((post) => ({
      id: post.id,
      attributes: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        publishedDate: post.publishedDate,
        readTime: post.readTime,
        featured: post.featured,
        published: post.published,
        featuredImage: {
          data: post.featuredImage
            ? {
                attributes: { url: post.featuredImage },
              }
            : null,
        },
      },
    }));

    return {
      data: transformedPosts,
      pagination: data.pagination,
    };
  } catch (error) {
    console.warn("getBlogPosts error:", error.message);
    return { data: [] };
  }
}

export async function getBlogPost(slug) {
  try {
    // Search by slug using the list endpoint
    const data = await fetchAPI(
      `/api/blog?search=${encodeURIComponent(slug)}&limit=1&published=true`,
      {
        next: { revalidate: 60 },
      },
    );

    // Find exact slug match
    const post = data.posts?.find((p) => p.slug === slug);
    if (!post) return null;

    // Transform to Strapi-like format
    return {
      id: post.id,
      attributes: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        publishedDate: post.publishedDate,
        readTime: post.readTime,
        featured: post.featured,
        published: post.published,
        featuredImage: {
          data: post.featuredImage
            ? {
                attributes: { url: post.featuredImage },
              }
            : null,
        },
      },
    };
  } catch (error) {
    console.warn("getBlogPost error:", error.message);
    return null;
  }
}

// --- PROJECTS ---

export async function getProjects(featured = false) {
  const params = new URLSearchParams({
    published: "true",
    limit: "100", // Get all published projects
  });

  // No need to add featured to params, we'll filter client-side
  // because API doesn't support featured query param

  const path = `/api/projects?${params.toString()}`;

  try {
    const data = await fetchAPI(path, {
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 3600 }, // No cache in dev, 1 hour in prod
    });

    // Filter featured if requested
    let projects = data.projects || [];
    if (featured) {
      projects = projects.filter((p) => p.featured === true);
    }

    // Transform to Strapi-like format for compatibility with existing components
    return {
      data: projects.map((project) => ({
        id: project.id,
        attributes: {
          slug: project.slug,
          client: project.client,
          title: project.client, // Use client as title for compatibility
          year: project.year,
          services: Array.isArray(project.services)
            ? project.services.join(", ")
            : project.services,
          tagline: Array.isArray(project.services)
            ? project.services.join(" • ")
            : project.services,
          thumbnail: {
            data: project.thumbnail
              ? {
                  attributes: { url: project.thumbnail },
                }
              : null,
          },
          logo: {
            data: project.logo
              ? {
                  attributes: { url: project.logo },
                }
              : null,
          },
          sections: project.sections || [],
          credits: project.credits || [],
          testimonial: project.testimonial
            ? {
                data: {
                  attributes: {
                    clientName: project.testimonial.clientName,
                    company: project.testimonial.company,
                    position: project.testimonial.position,
                    content: project.testimonial.content,
                    rating: project.testimonial.rating,
                    avatar: {
                      data: project.testimonial.avatar
                        ? {
                            attributes: { url: project.testimonial.avatar },
                          }
                        : null,
                    },
                  },
                },
              }
            : null,
          featured: project.featured,
          published: project.published,
        },
      })),
    };
  } catch (error) {
    console.warn("getProjects error:", error.message);
    return { data: [] };
  }
}

export async function getProject(slug) {
  try {
    const response = await fetchAPI(`/api/projects?search=${slug}&limit=1`, {
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 3600 },
    });

    const project = response.projects?.[0];
    if (!project) return null;

    // Transform to Strapi-like format
    return {
      id: project.id,
      attributes: {
        slug: project.slug,
        client: project.client,
        year: project.year,
        services: Array.isArray(project.services)
          ? project.services.join(", ")
          : project.services,
        thumbnail: {
          data: project.thumbnail
            ? {
                attributes: { url: project.thumbnail },
              }
            : null,
        },
        logo: {
          data: project.logo
            ? {
                attributes: { url: project.logo },
              }
            : null,
        },
        sections:
          project.sections?.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            images: {
              data: (s.images || []).map((url) => ({
                attributes: { url },
              })),
            },
            order: s.order,
          })) || [],
        credits:
          project.credits?.map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
          })) || [],
        testimonial: project.testimonial
          ? {
              data: {
                attributes: {
                  clientName: project.testimonial.clientName,
                  company: project.testimonial.company,
                  position: project.testimonial.position,
                  content: project.testimonial.content,
                  rating: project.testimonial.rating,
                  avatar: project.testimonial.avatar
                    ? {
                        data: {
                          attributes: { url: project.testimonial.avatar },
                        },
                      }
                    : null,
                },
              },
            }
          : null,
        featured: project.featured,
        published: project.published,
      },
    };
  } catch (error) {
    console.warn("getProject error:", error.message);
    return null;
  }
}

// --- TESTIMONIALS ---

export async function getTestimonials() {
  const params = new URLSearchParams({
    published: "true",
    limit: "100",
  });

  const path = `/api/testimonials?${params.toString()}`;

  try {
    const data = await fetchAPI(path, {
      next: { revalidate: 3600 },
    });

    // Transform to Strapi-like format
    return {
      data: (data.testimonials || []).map((testimonial) => ({
        id: testimonial.id,
        attributes: {
          clientName: testimonial.clientName,
          company: testimonial.company,
          position: testimonial.position,
          content: testimonial.content,
          rating: testimonial.rating,
          avatar: {
            data: testimonial.avatar
              ? {
                  attributes: { url: testimonial.avatar },
                }
              : null,
          },
          published: testimonial.published,
        },
      })),
    };
  } catch (error) {
    console.warn("getTestimonials error:", error.message);
    return { data: [] };
  }
}
