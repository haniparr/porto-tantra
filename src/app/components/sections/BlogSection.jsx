import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";

// Import CSS khusus blog jika belum ada di layout
import "@/app/styles/blog.css";

export default async function BlogSection() {
  // Fetch Featured Blogs
  const response = await getBlogPosts(true);
  const blogs = response.data || [];

  return (
    <section className="blog-section">
      <div className="blog-header">
        <span className="section-label">[ MY THOUGHT ]</span>
        <h2 className="section-title">
          The view from here: A collection of personal notes.
        </h2>
      </div>

      <div className="blog-grid">
        {blogs.slice(0, 3).map((item) => {
          const attrs = item.attributes;
          const imageUrl =
            getStrapiMedia(attrs.featuredImage) ||
            "https://images.unsplash.com/photo-1516426122078-c23e76319801";

          return (
            <div className="blog-card" key={item.id} data-slug={attrs.slug}>
              <div className="blog-card-bg" style={{ position: "relative" }}>
                {/* Next Image dengan fill parent */}
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
