"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getStrapiMedia } from "@/app/lib/utils";
import "@/app/styles/case-study.css"; // Import CSS spesifik

export default function CaseStudyUI({ project }) {
  const [activeSection, setActiveSection] = useState(
    project.sections[0]?.id || "",
  );
  const observerRef = useRef(null);

  // Handle Credits: Pastikan selalu array
  const credits = Array.isArray(project.credits) ? project.credits : [];

  // --- LOGIC: SCROLL SPY ---
  useEffect(() => {
    // Cleanup observer lama jika ada
    if (observerRef.current) observerRef.current.disconnect();

    const observerOptions = {
      root: null,
      // Logic asli: '-40% 0px -40% 0px' (Aktif saat elemen berada di tengah layar)
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      handleIntersect,
      observerOptions,
    );

    // Observe semua section
    const sections = document.querySelectorAll(".cs-section");
    sections.forEach((section) => observerRef.current.observe(section));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [project]); // Re-run jika project berubah

  // --- LOGIC: SMOOTH SCROLL CLICK ---
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset sedikit untuk header sticky jika ada, atau biarkan default
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id); // Set active langsung agar responsif
    }
  };

  if (!project) return <div className="error-state">Project not found</div>;

  // Removed custom renderMarkdown helper

  return (
    <article className="case-study">
      <div className="cs-container">
        {/* LEFT SIDE - STICKY SIDEBAR */}
        <aside className="cs-sidebar">
          <div className="cs-sidebar-content">
            <div className="cs-header-group">
              <div className="cs-header">
                <h1 className="cs-main-title">{project.title}</h1>
                <p className="cs-subtitle">{project.subtitle}</p>
              </div>

              <nav className="cs-nav">
                {project.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`cs-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => scrollToSection(section.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3 className="cs-nav-title">{section.title}</h3>
                    <div className="cs-nav-desc-wrapper">
                      <div className="cs-nav-desc markdown-content">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <span {...props} />, // Render p as span to maintain layout
                          }}
                        >
                          {section.description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {credits.length > 0 && (
              <div className="cs-credits">
                <h4 className="cs-credits-title">Credits to:</h4>
                <div className="cs-credits-list">
                  {credits.map((credit, index) => (
                    <div key={index} className="cs-credit-item">
                      <span className="cs-credit-name">{credit.name}</span>
                      <span className="cs-credit-role">{credit.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT SIDE - SCROLLING CONTENT */}
        <div className="cs-content">
          {project.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="cs-section"
              data-id={section.id}
            >
              <div className="cs-gallery">
                {section.images.map((img, imgIndex) => {
                  // Handle URL gambar (apakah string URL langsung atau path dari Strapi)
                  const imgSrc =
                    typeof img === "string" ? img : getStrapiMedia(img);

                  return (
                    <div
                      key={imgIndex}
                      className="cs-image-wrapper"
                      style={{ position: "relative" }}
                    >
                      {/* Gunakan Next Image untuk optimasi */}
                      <Image
                        src={imgSrc}
                        alt={`${section.title} image ${imgIndex + 1}`}
                        width={1200} // Estimasi lebar container konten
                        height={800} // Aspect ratio default, akan diatur CSS object-fit
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                        sizes="(max-width: 768px) 100vw, 70vw"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="cs-footer-spacer"></div>
        </div>
      </div>
    </article>
  );
}
