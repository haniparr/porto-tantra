"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedHeading({
  text,
  as: Tag = "h1", // Bisa jadi 'h1' atau 'h2'
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Split text menjadi array kata
  const words = text.split(" ");

  return (
    <Tag
      ref={elementRef}
      className={className}
      style={{ opacity: 1 }} // Parent visible
    >
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
            transition: "all 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9)",
            transitionDelay: `${index * 0.1}s`, // Stagger delay
            // State based styles
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(10px)",
            transform: isVisible
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 20px, 0)",
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
