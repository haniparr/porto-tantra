"use client";

import { useRef } from "react";

export default function TestimonialsSlider({ initialData = [] }) {
  const sliderRef = useRef(null);

  // Placeholder Data
  const placeholders = [
    {
      clientName: "Sarah Jenkins",
      company: "CEO, TechStart",
      content:
        "The team transformed our undefined concept into a market-leading brand identity. Truly exceptional work that exceeded all expectations.",
    },
    {
      clientName: "Mark Thompson",
      company: "Founder, Innovate",
      content:
        "Professional, efficient, and creatively brilliant. They didn't just design a logo, they built our entire visual language from scratch.",
    },
    {
      clientName: "Elena Rodriguez",
      company: "Director, FutureScale",
      content:
        "From the first meeting to final delivery, the process was seamless. The results speak for themselves - our conversion rate doubled.",
    },
    {
      clientName: "Elena Rodriguez",
      company: "Director, FutureScale",
      content:
        "From the first meeting to final delivery, the process was seamless. The results speak for themselves - our conversion rate doubled.",
    },
  ];

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const dataToRender = initialData.length > 0 ? initialData : placeholders;

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 320; // Lebar kartu + gap
    if (direction === "left") {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    sliderRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.scrollBehavior = "smooth";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="testimonials-section">
      <div className="section-layout">
        <div className="section-label">
          <span>[ TESTIMONIALS ]</span>
        </div>
        <div
          className="intro-content"
          style={{ minWidth: 0, overflow: "hidden" }}
        >
          <div
            className="testimonials-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <h1 className="intro-headline" style={{ marginBottom: 0 }}>
              What my clients said
            </h1>
            <div
              className="testimonial-controls"
              style={{ display: "flex", gap: "1rem" }}
            >
              <button
                onClick={() => scrollSlider("left")}
                className="nav-arrow-btn"
                aria-label="Previous"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollSlider("right")}
                className="nav-arrow-btn"
                aria-label="Next"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="testimonial-slider-wrapper">
            <div
              className="testimonial-slider"
              id="testimonial-slider"
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{
                display: "flex",
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                cursor: "grab",
                userSelect: "none",
                gap: "20px",
              }}
            >
              {dataToRender.map((t, index) => {
                const data = t.attributes || t;
                const num = (index + 1).toString().padStart(2, "0");

                return (
                  <div
                    className="service-card testimonial-slide-card"
                    key={index}
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      marginRight: 0,
                    }}
                  >
                    <div className="card-header">
                      <span className="service-number">{num}</span>
                    </div>
                    <div className="card-content">
                      <h3 className="service-title">
                        {data.clientName || "Client Name"}
                      </h3>
                      <p
                        className="service-company"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.9rem",
                          marginBottom: "1rem",
                          marginTop: "-0.5rem",
                        }}
                      >
                        {data.company}
                      </p>
                      <p className="service-description">
                        &quot;{data.content}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
