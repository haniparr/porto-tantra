"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CursorBlur() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center the cursor element
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "400px",
        height: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.0)", // Transparent background
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        backdropFilter: "blur(12px)", // Increased blur
        WebkitBackdropFilter: "blur(12px)", // Safari support
        maskImage: "radial-gradient(circle, black 30%, transparent 70%)", // Soft edges
        WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
