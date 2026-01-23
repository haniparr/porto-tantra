import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import "@/app/styles/blog.css";

// 1. Generate Metadata Dinamis untuk SEO
export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  const attrs = post.attributes;
  const imageUrl = getStrapiMedia(attrs.featuredImage);

  return {
    title: `${attrs.title} | Blog`,
    description: attrs.excerpt,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Helper Format Tanggal
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 2. Main Component
export default async function BlogDetailsPage({ params }) {
  // Parallel Fetch: Artikel Utama & Artikel Lainnya (untuk Read Next)
  const [post, recentPostsResponse] = await Promise.all([
    getBlogPost(params.slug),
    getBlogPosts(),
  ]);

  if (!post) return notFound(); // Tampilkan halaman 404

  const attrs = post.attributes;
  const imageUrl = getStrapiMedia(attrs.featuredImage);

  // Logic Read Next: Ambil 2 post terbaru, kecuali post yang sedang dibuka
  const otherPosts = (recentPostsResponse.data || [])
    .filter((p) => p.attributes.slug !== params.slug)
    .slice(0, 2);

  return (
    <div className="blog-details-page">
      <div className="blog-details-container">
        {/* Hero Section */}
        <header className="article-header">
          <div className="article-meta">
            <span className="meta-category">{attrs.category || "News"}</span>
            <span className="meta-separator">•</span>
            <span className="meta-date">{formatDate(attrs.publishedDate)}</span>
            {attrs.readTime && (
              <>
                <span className="meta-separator">•</span>
                <span className="meta-read-time">{attrs.readTime}</span>
              </>
            )}
          </div>
          <h1 className="article-title">{attrs.title}</h1>
          {attrs.excerpt && <p className="article-excerpt">{attrs.excerpt}</p>}
        </header>

        {imageUrl && (
          <div
            className="article-hero-image"
            style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}
          >
            <Image
              src={imageUrl}
              alt={attrs.title}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Content Section */}
        <article className="article-content">
          {/* PENTING: Render HTML dari Strapi */}
          <div dangerouslySetInnerHTML={{ __html: attrs.content || "" }} />
        </article>

        {/* Read Next Section */}
        {otherPosts.length > 0 && (
          <section className="read-next-section">
            <div className="read-next-header">
              <h3>Read Our Next Article</h3>
            </div>
            <div className="read-next-grid">
              {otherPosts.map((nextPost) => {
                const nextAttrs = nextPost.attributes;
                const nextImage =
                  getStrapiMedia(nextAttrs.featuredImage) ||
                  "https://images.unsplash.com/photo-1551836022-d5d88e9218df";

                return (
                  <article className="insight-card" key={nextPost.id}>
                    <Link href={`/blog/${nextAttrs.slug}`}>
                      <div
                        className="insight-card-image"
                        style={{ position: "relative" }}
                      >
                        <Image
                          src={nextImage}
                          alt={nextAttrs.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <div className="insight-card-overlay"></div>
                      </div>
                      <div className="insight-card-content">
                        <span className="article-tag">
                          {nextAttrs.category || "News"}
                        </span>
                        <h4 className="insight-title">{nextAttrs.title}</h4>
                        <p className="insight-excerpt">{nextAttrs.excerpt}</p>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
