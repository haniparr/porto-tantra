"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Corrected Imports
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import GradualBlur from "@/app/components/ui/GradualBlur";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading";
import { getBlogPosts } from "@/app/lib/api";
// Import CSS directly to ensure styles work
import "@/app/styles/blog-page.css";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await getBlogPosts();

        // Fallback Mock Data if API fails/empty
        if (!response?.data || response.data.length === 0) {
          setPosts([
            {
              id: 1,
              attributes: {
                title: "Maximizing Efficiency in Operations",
                excerpt:
                  "Discover strategies to streamline your business processes and enhance productivity.",
                slug: "maximizing-efficiency",
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
                title: "The Ultimate Guide to Budgeting",
                excerpt: "Budgeting is the cornerstone of financial stability.",
                slug: "ultimate-guide-budgeting",
                category: "Finance",
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
              id: 3,
              attributes: {
                title: "Business Growth Strategies",
                excerpt:
                  "How to scale your business effectively in a competitive market.",
                slug: "business-growth",
                category: "Strategy",
                featuredImage: {
                  data: {
                    attributes: {
                      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
                    },
                  },
                },
              },
            },
          ]);
        } else {
          setPosts(response.data);
        }
      } catch (e) {
        console.error("Error loading blog posts", e);
      }
    }
    loadPosts();
  }, []);

  const getImageUrl = (post) => {
    const attrs = post.attributes || post;
    const url =
      attrs.featuredImage?.data?.attributes?.url || attrs.featuredImage?.url;
    if (!url) return "https://placehold.co/800x600?text=No+Image";
    if (url.startsWith("http")) return url;
    return `http://localhost:1337${url}`;
  };

  return (
    <>
      <Navbar />
      <div
        id="main-wrapper"
        style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}
      >
        <div className="gradient-container">
          <div className="blog-page" style={{ paddingTop: "120px" }}>
            <div className="blog-container">
              <header className="blog-page-header">
                <AnimatedHeading
                  text="Blog & articles"
                  as="h1"
                  direction="right"
                  className="blog-page-title"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                  }}
                />
              </header>

              <section className="latest-insights">
                <div className="insights-grid">
                  {posts.map((post) => {
                    const attrs = post.attributes || post;
                    return (
                      <Link
                        href={`/blog/${attrs.slug}`}
                        key={post.id}
                        className="insight-card-link"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <article className="insight-card">
                          <div className="insight-card-image">
                            <img src={getImageUrl(post)} alt={attrs.title} />
                            <div className="insight-card-overlay"></div>
                          </div>
                          <div className="insight-card-content">
                            <span className="article-tag">
                              {attrs.category || "News"}
                            </span>
                            <h4 className="insight-title">{attrs.title}</h4>
                            <p className="insight-excerpt">{attrs.excerpt}</p>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <GradualBlur />
    </>
  );
}
