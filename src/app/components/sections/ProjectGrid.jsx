"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
// import Image from "next/image"; // Not used in the main list items anymore (using standard img), optional for optimization but user code uses standard img
import { getStrapiMedia } from "@/app/lib/utils";

export default function ProjectGrid({ projects = [] }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const previewRef = useRef(null);
  const requestRef = useRef(null);

  // Mouse position state
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 }); // Smooth cursor position

  // Handle active preview state
  const isHovering = hoveredProject !== null;

  useEffect(() => {
    // Only add listeners if we have projects
    if (projects.length === 0) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // Linear interpolation for smooth movement
      const lerp = (start, end, factor) => start + (end - start) * factor;

      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.15);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.15);

      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${
          cursorPos.current.x + 20
        }px, ${cursorPos.current.y + 20}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    // Initialize animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [projects.length]);

  return (
    <>
      <section className="portfolio-list-section">
        <div className="portfolio-list">
          {projects.map((project, index) => {
            // ADAPTATION: Handle Strapi Structure
            const attrs = project.attributes || {};
            const logoUrl = getStrapiMedia(attrs.logo);
            // Used for preview:
            const thumbnailUrl =
              getStrapiMedia(attrs.thumbnail) || getStrapiMedia(attrs.image);

            // Hover data object mimicking flattened structure
            const hoverData = {
              image: thumbnailUrl,
              ...attrs,
            };

            return (
              <Link
                href={`/work/${attrs.slug}`}
                key={index}
                className="portfolio-item-link"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  className="portfolio-item"
                  onMouseEnter={() => setHoveredProject(hoverData)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="item-col client">
                    {/* Using standard img for external URLs or small icons if not optimized */}
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={`${attrs.client} Logo`}
                        className="client-logo"
                      />
                    )}
                    {attrs.client || attrs.title}{" "}
                    <span className="client-year">{attrs.year}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Floating Preview Image */}
      <div
        ref={previewRef}
        className={`portfolio-preview ${isHovering ? "active" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.2s ease",
          // transform is handled by JS for performance
        }}
      >
        <div
          className="preview-inner"
          style={{
            width: "300px",
            height: "200px",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          {/* We strictly use standard img here for immediate updates without hydration mismatch issues during rapid hover */}
          {hoveredProject && hoveredProject.image && (
            <img
              src={hoveredProject.image}
              alt="Project Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </div>

      {/* CSS needs to be ensured globally or scoped here */}
      <style jsx global>{`
        .portfolio-list-section {
          padding: 2rem 0;
          width: 100%;
        }
        .portfolio-list {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .portfolio-item {
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.3s ease;
          cursor: pointer;
        }
        .portfolio-item:hover {
          background-color: rgba(255, 255, 255, 0.02);
          padding-left: 1rem; /* Slight shift */
        }
        .item-col {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 500;
        }
        .client-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          margin-right: 1.5rem;
          border-radius: 50%;
          background: #fff; /* fallback */
        }
        .client-year {
          margin-left: auto;
          font-size: 1rem;
          opacity: 0.5;
          font-weight: normal;
        }

        /* Pagination if needed */
        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem 0;
          gap: 2rem;
        }
      `}</style>
    </>
  );
}
