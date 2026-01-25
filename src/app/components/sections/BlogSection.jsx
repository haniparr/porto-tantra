import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/app/lib/api";
import { getImageWithFallback } from "@/app/lib/utils";
import "@/app/styles/blog.css";

// Default blogs (tetap sama)
function getDefaultBlogs() {
  return [
    {
      id: "01",
      attributes: {
        slug: "majestic-creatures",
        title: "Majestic Creatures of the African Savanna",
        excerpt:
          "Capturing the Exquisite Patterns and Dynamic Energy of Africa's Most Iconic Big Cat",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "02",
      attributes: {
        slug: "temple-silhouette",
        title: "A Temple's Serene Silhouette",
        excerpt:
          "Exploring the spiritual architecture and peaceful atmosphere of ancient eastern temples.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "03",
      attributes: {
        slug: "moments-framed",
        title: "Moments Framed in Portraits",
        excerpt:
          "A deep dive into the art of capturing human emotion and storytelling through portraiture.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "04",
      attributes: {
        slug: "urban-solitude",
        title: "Urban Solitude",
        excerpt:
          "Finding stillness in the chaos of city life through the lens of architectural minimalism.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
  ];
}

export default async function BlogSection() {
  let blogs = [];

  try {
    const response = await getBlogPosts();

    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      // ✅ TIDAK PERLU FILTER - Terima semua blog posts
      blogs = response.data;
      console.log(
        "✅ Using Strapi data for Blog Section:",
        blogs.length,
        "posts",
      );
    } else {
      blogs = getDefaultBlogs();
      console.log("⚠️ Using hardcoded data for Blog Section");
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    blogs = getDefaultBlogs();
    console.log("⚠️ Using hardcoded data for Blog Section (API error)");
  }

  return (
    <section className="blog-section">
      <div className="blog-header">
        <span className="section-label">[ MY THOUGHT ]</span>
        <h2 className="section-title">
          The view from here: A collection of personal notes.
        </h2>
      </div>

      <div className="blog-grid">
        {blogs.map((item) => {
          if (!item) return null;

          // ✅ Robust data access: Handle both v4 (attributes) and v5/flattened data
          const attrs = item.attributes || item;
          if (!attrs) return null;

          // ✅ Gunakan helper dengan fallback
          const imageUrl = getImageWithFallback(
            attrs.featuredImage,
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
          );

          return (
            <div className="blog-card" key={item.id} data-slug={attrs.slug}>
              <div className="blog-card-bg" style={{ position: "relative" }}>
                <Image
                  src={imageUrl}
                  alt={attrs.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="blog-card-overlay"></div>

              <div className="blog-content">
                <h3 className="blog-title">{attrs.title}</h3>
                <p className="blog-desc">{attrs.excerpt || "No description"}</p>

                <Link href={`/blog/${attrs.slug}`} className="blog-btn">
                  MORE DETAILS
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6H11M11 6L6 1M11 6L6 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
