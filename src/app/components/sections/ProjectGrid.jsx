"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getImageWithFallback } from "@/app/lib/utils";
import "@/app/styles/grid.css";

export default function ProjectGrid({ projects = [] }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const previewRef = useRef(null);
  const requestRef = useRef(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  const isHovering = hoveredProject !== null;

  useEffect(() => {
    if (projects.length === 0) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
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
            // ✅ Handle both nested (.attributes) and flattened data structures
            const attrs = project.attributes || project;

            // ✅ Logo dengan fallback
            const logoUrl = getImageWithFallback(
              attrs.logo,
              "https://placehold.co/40x40/1a1a1a/ffffff?text=" +
                (attrs.client?.[0] || "P"),
            );

            // ✅ Thumbnail dengan fallback
            const thumbnailUrl = getImageWithFallback(
              attrs.thumbnail || attrs.image,
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            );

            const hoverData = {
              image: thumbnailUrl,
              ...attrs,
            };

            return (
              <Link
                href={`/work/${attrs.slug}`}
                key={project.id || index}
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
                    <img
                      src={logoUrl}
                      alt={`${attrs.client || attrs.title} Logo`}
                      className="client-logo"
                    />
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
        }}
      >
        <div
          className="preview-inner"
          style={{
            width: "320px",
            height: "400px", // 4:5 aspect ratio (320 x 400)
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
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
    </>
  );
}
