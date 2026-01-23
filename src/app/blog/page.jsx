import { getBlogPosts } from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";
import "@/app/styles/blog-page.css";
import GradientWrapper from "@/app/components/ui/GradientWrapper";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading";

// --- DATA FALLBACK ---
function getDefaultBlogs() {
  return [
    {
      id: 1,
      attributes: {
        slug: "maximizing-efficiency",
        title: "Maximizing Efficiency in Operations",
        excerpt:
          "Discover strategies to streamline your business processes and enhance productivity.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: 2,
      attributes: {
        slug: "business-growth",
        title: "Business Growth Strategies",
        excerpt:
          "Discover strategies to streamline your business processes and enhance productivity.",
        category: "Insight",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
  ];
}

export default async function BlogPage() {
  let blogs = [];

  try {
    const response = await getBlogPosts();
    if (response && response.data) {
      blogs = response.data;
    }
  } catch (error) {
    console.warn("API Error (Blog Page):", error.message);
  }

  if (blogs.length === 0) {
    blogs = getDefaultBlogs();
  }

  return (
    <div className="blog-page">
      <GradientWrapper className="min-h-screen pt-24">
        <div className="blog-container">
          <header className="blog-page-header">
            <AnimatedHeading
              text="Blog & articles"
              as="h1"
              className="blog-page-title"
            />
          </header>

          <section className="latest-insights">
            <div className="insights-grid">
              {blogs.map((blog) => {
                // --- SAFETY CHECK (PERBAIKAN UTAMA) ---
                // Jika item blog kosong atau tidak punya attributes, kita lewati (skip)
                if (!blog || !blog.attributes) {
                  return null;
                }

                const attrs = blog.attributes;

                // Ambil URL Gambar dengan aman
                const imageUrl =
                  attrs.featuredImage?.data?.attributes?.url ||
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2";

                return (
                  <article className="insight-card" key={blog.id}>
                    <Link href={`/blog/${attrs.slug || "#"}`}>
                      <div
                        className="insight-card-image"
                        style={{ position: "relative" }}
                      >
                        <Image
                          src={imageUrl}
                          alt={attrs.title || "Blog Image"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="insight-card-overlay"></div>
                      </div>
                      <div className="insight-card-content">
                        <span className="article-tag">
                          {attrs.category || "News"}
                        </span>
                        <h4 className="insight-title">
                          {attrs.title || "Untitled"}
                        </h4>
                        <p className="insight-excerpt">{attrs.excerpt || ""}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </GradientWrapper>
    </div>
  );
}
