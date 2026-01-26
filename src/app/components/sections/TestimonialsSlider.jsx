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
  ];

  // Debug logging
  console.log("TestimonialsSlider received data:", initialData);
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

  return (
    <section className="testimonials-section">
      <div className="section-layout">
        <div className="section-label">
          <span>[ TESTIMONIALS ]</span>
        </div>
        <div className="intro-content">
          <div
            className="testimonials-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 0,
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

          <div
            className="testimonial-slider-wrapper"
            style={{ overflow: "hidden" }}
          >
            <div
              className="intro-features-grid testimonial-slider"
              id="testimonial-slider"
              ref={sliderRef}
              style={{
                display: "flex",
                overflowX: "auto",
                scrollBehavior: "smooth",
                gridTemplateColumns: "none",
                scrollbarWidth: "none",
                margin: "var(--spacing-md) 0",
              }}
            >
              {dataToRender.map((t, index) => {
                // Normalisasi data (jika dari API Strapi atau Placeholder)
                const data = t.attributes || t;
                const num = (index + 1).toString().padStart(2, "0");

                return (
                  <div
                    className="service-card"
                    key={index}
                    style={{ minWidth: "300px", marginRight: "20px" }}
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
