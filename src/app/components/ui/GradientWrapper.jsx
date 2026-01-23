"use client";

import { useEffect, useRef } from "react";

export default function GradientWrapper({ children, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;

    const updateGradient = (x, y, rect) => {
      // Hitung persentase posisi mouse relatif terhadap container
      const xPercent = ((x - rect.left) / rect.width) * 100;
      const yPercent = ((y - rect.top) / rect.height) * 100;

      container.style.setProperty("--mouse-x", `${xPercent}%`);
      container.style.setProperty("--mouse-y", `${yPercent}%`);
    };

    const handleMouseMove = (e) => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          updateGradient(e.clientX, e.clientY, rect);
          rafId = null;
        });
      }
    };

    const handleMouseEnter = () => {
      container.classList.add("active");
    };

    const handleMouseLeave = () => {
      container.classList.remove("active");
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`gradient-container ${className}`}
      // Pastikan CSS .gradient-container menggunakan var(--mouse-x) dan var(--mouse-y)
    >
      {children}
    </div>
  );
}
