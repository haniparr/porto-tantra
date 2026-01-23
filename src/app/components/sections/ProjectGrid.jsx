"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/app/lib/utils";

// Helper Interpolasi (Lerp)
const lerp = (start, end, factor) => start + (end - start) * factor;

export default function ProjectGrid({ projects = [] }) {
  // State untuk mengontrol gambar mana yang aktif
  const [activeImage, setActiveImage] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Refs untuk animasi performa tinggi (menghindari re-render state berlebih)
  const previewRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);

  useEffect(() => {
    // 1. Mouse Tracker
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Init posisi awal agar tidak 'jump'
      if (currentPos.current.x === 0 && currentPos.current.y === 0) {
        currentPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 2. Animation Loop (60fps)
    const animate = () => {
      if (!previewRef.current) return;

      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // Smooth movement (Lerp)
      currentPos.current.x = lerp(currentPos.current.x, targetX, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetY, 0.15);

      // Offset +20px agar tidak menutupi kursor mouse
      const x = currentPos.current.x + 20;
      const y = currentPos.current.y + 20;

      // Direct DOM manipulation via Ref
      previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseEnter = (imageUrl) => {
    if (imageUrl) {
      setActiveImage(imageUrl);
      setIsActive(true);
    }
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  if (!projects.length) return null;

  return (
    <>
      <section className="portfolio-list-section">
        <div className="portfolio-list">
          {projects.map((project, index) => {
            const attrs = project.attributes;
            const previewUrl =
              getStrapiMedia(attrs.thumbnail) || getStrapiMedia(attrs.image);
            const logoUrl = getStrapiMedia(attrs.logo);

            return (
              <div
                key={index}
                className="portfolio-item" // Class asli dipertahankan
                onMouseEnter={() => handleMouseEnter(previewUrl)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/work/${attrs.slug}`}
                  style={{
                    display: "block",
                    width: "100%",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div className="item-col client">
                    {/* Logo Client */}
                    {logoUrl && (
                      <Image
                        src={logoUrl}
                        alt={`${attrs.client} Logo`}
                        width={40}
                        height={40}
                        className="client-logo"
                        style={{
                          objectFit: "contain",
                          display: "inline-block",
                          marginRight: "1rem",
                        }}
                      />
                    )}

                    {/* Nama Project & Tahun */}
                    {attrs.client || attrs.title}
                    <span className="client-year">{attrs.year}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Preview Element */}
      <div
        ref={previewRef}
        className="portfolio-preview"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: isActive ? 1 : 0,
          visibility: isActive ? "visible" : "hidden",
          transition: "opacity 0.3s ease", // Smooth fade in/out
        }}
      >
        <div
          className="preview-inner"
          style={{
            position: "relative",
            width: "300px",
            height: "200px",
            overflow: "hidden",
          }}
        >
          {activeImage && (
            <Image
              src={activeImage}
              alt="Project Preview"
              fill
              style={{ objectFit: "cover" }}
              priority // Load cepat
            />
          )}
        </div>
      </div>
    </>
  );
}
