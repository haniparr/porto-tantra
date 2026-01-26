import Link from "next/link";
import Image from "next/image";
import { getBlogPost, getBlogPosts } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import "@/app/styles/blog.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// ✅ HARDCODED DEFAULT POST (sama seperti Vite)
function getDefaultPost() {
  return {
    id: "default-1",
    attributes: {
      slug: "default-guide-budgeting-2024",
      title: "The Ultimate Guide to Budgeting in 2024",
      excerpt: "Learn effective budgeting strategies for financial success",
      content: `
        <p>Budgeting is the cornerstone of financial stability, and 2024 presents new opportunities and challenges that require a fresh approach.</p>
        <h2>1. Real-Time Insights</h2>
        <p>One of the most significant advantages of SaaS analytics is real-time access to data. Traditional analytics tools often require manual data entry or periodic updates, leading to delays in decision-making. With SaaS platforms, businesses can monitor key performance indicators (KPIs) as they happen, enabling faster responses to market changes and customer needs.</p>
        <h2>2. Scalability and Flexibility</h2>
        <p>SaaS platforms are designed to scale as your business grows. Whether you're a startup or an enterprise, these tools can handle increasing data volumes without requiring significant infrastructure investments. This scalability ensures that your analytics capabilities can keep pace with your business expansion.</p>
      `,
      category: "News",
      publishedDate: "2024-08-12",
      readTime: "5 min read",
      featuredImage: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          },
        },
      },
    },
  };
}

// ✅ HARDCODED "READ NEXT" ARTICLES (sama seperti Vite)
function getDefaultReadNext() {
  return [
    {
      id: "rn-1",
      attributes: {
        slug: "business-growth",
        title: "Business Growth Strategies",
        excerpt:
          "Discover strategies to streamline your business processes and enhance productivity.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "rn-2",
      attributes: {
        slug: "maximizing-efficiency",
        title: "Maximizing Efficiency",
        excerpt:
          "Discover strategies to streamline your business processes and enhance productivity.",
        category: "News",
        featuredImage: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
  ];
}

// 1. Generate Metadata Dinamis untuk SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const response = await getBlogPosts();
    const post = response.data?.find((p) => {
      const pSlug = p.attributes?.slug || p.slug;
      return pSlug === decodedSlug;
    });

    if (!post) {
      const defaultPost = getDefaultPost();
      return {
        title: `${defaultPost.attributes.title} | Blog`,
        description: defaultPost.attributes.excerpt,
      };
    }

    const attrs = post.attributes || post;
    const imageUrl = getStrapiMedia(attrs.featuredImage);

    return {
      title: `${attrs.title} | Blog`,
      description: attrs.excerpt,
      openGraph: {
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    const defaultPost = getDefaultPost();
    return {
      title: `${defaultPost.attributes.title} | Blog`,
      description: defaultPost.attributes.excerpt,
    };
  }
}

// Helper to fix Strapi Markdown (handle line breaks)
function fixMarkdown(content) {
  if (typeof content !== "string") return "";
  return content.replace(/\n/g, "\n\n");
}

// Helper Format Tanggal
function formatDate(dateString) {
  if (!dateString) return "Date not available";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Date not available";
  }
}

// 2. Main Component
export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let post = null;
  let isUsingFallback = false;

  // ✅ TRY-CATCH ERROR HANDLING like Vite
  try {
    console.log("Fetching blog post with slug:", decodedSlug);
    // Use getBlogPosts (fetch all) instead of single fetch to ensure consistency
    const response = await getBlogPosts();

    post = response.data?.find((p) => {
      const pSlug = p.attributes?.slug || p.slug;
      return pSlug === decodedSlug;
    });

    // ✅ FALLBACK if post not found
    if (!post) {
      console.warn("Blog post not found for slug:", decodedSlug);
      post = getDefaultPost();
      isUsingFallback = true;
      console.log("⚠️ Using default post fallback");
    } else {
      console.log("✅ Using Strapi blog post data");
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    post = getDefaultPost();
    isUsingFallback = true;
    console.log("⚠️ Using default post fallback (API error)");
  }

  // ✅ SAFETY CHECKS like Vite
  const attrs = post.attributes || post;

  if (!attrs) {
    console.error("Blog post has no attributes");
    const defaultPost = getDefaultPost();
    return (
      <div className="blog-details-page">
        <div className="blog-details-container">
          <div className="error-state">Invalid blog post data</div>
        </div>
      </div>
    );
  }

  // ✅ Extract data with fallbacks (like Vite)
  const title = attrs.title || "Untitled Post";
  const excerpt = attrs.excerpt || "";
  const content = attrs.content || "<p>No content available</p>";
  const category = attrs.category || "News";
  const publishedDate = attrs.publishedDate;
  const readTime = attrs.readTime || "5 min read";
  const imageUrl = getStrapiMedia(attrs.featuredImage);

  // ✅ DYNAMIC READ NEXT
  // Filter out current post and take first 2
  let readNextArticles = [];
  if (response?.data && Array.isArray(response.data)) {
    readNextArticles = response.data
      .filter((p) => {
        const pSlug = p.attributes?.slug || p.slug;
        return pSlug !== decodedSlug;
      })
      .slice(0, 2);
  }

  // Fallback if no others found (optional, or keep empty)
  if (readNextArticles.length === 0) {
    const defaultReadNext = getDefaultReadNext();
    // Only use default if we are using fallback post, otherwise show nothing or maybe random
    if (isUsingFallback) {
      readNextArticles = defaultReadNext;
    }
  }

  return (
    <div className="blog-details-page">
      <div className="blog-details-container">
        {/* Hero Section */}
        <header className="article-header">
          <div className="article-meta">
            <span className="meta-category">{category}</span>
            <span className="meta-separator">•</span>
            <span className="meta-date">{formatDate(publishedDate)}</span>
            <span className="meta-separator">•</span>
            <span className="meta-read-time">{readTime}</span>
          </div>
          <h1 className="article-title">{title}</h1>
          {excerpt && <p className="article-excerpt">{excerpt}</p>}
        </header>

        {imageUrl && (
          <div
            className="article-hero-image"
            style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Content Section */}
        <article className="article-content">
          {/* ✅ Render Markdown using ReactMarkdown */}
          <div className="markdown-content">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="article-text" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="article-h1" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="article-h2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="article-h3" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="article-list" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="article-list ordered" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="article-list-item" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="article-quote" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="article-link" {...props} />
                ),
                u: ({ node, ...props }) => (
                  <u className="article-underline" {...props} />
                ),
                del: ({ node, ...props }) => (
                  <del className="article-strikethrough" {...props} />
                ),
                img: ({ node, ...props }) => (
                  <div className="article-image-wrapper">
                    <img className="article-image" {...props} />
                  </div>
                ),
              }}
            >
              {fixMarkdown(content)}
            </ReactMarkdown>
          </div>
        </article>

        {/* Read Next Section - ✅ HARDCODED like Vite */}
        <section className="read-next-section">
          <div className="read-next-header">
            <h3>Read Our Next Article</h3>
          </div>
          <div className="read-next-grid">
            {readNextArticles.map((nextPost) => {
              const nextAttrs = nextPost.attributes || nextPost;
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
                      <span className="article-tag">{nextAttrs.category}</span>
                      <h4 className="insight-title">{nextAttrs.title}</h4>
                      <p className="insight-excerpt">{nextAttrs.excerpt}</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
