"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm"; // ✅ ADD: Support for GitHub Flavored Markdown
import { getStrapiMedia } from "@/app/lib/utils";
import "@/app/styles/case-study.css";

export default function CaseStudyUI({ project }) {
  const [activeSection, setActiveSection] = useState(
    project.sections[0]?.id || "",
  );
  const activeSectionRef = useRef(activeSection);
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const observerRef = useRef(null);

  const credits = Array.isArray(project.credits) ? project.credits : [];

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // --- SYNC SCROLL SIDEBAR ---
  useEffect(() => {
    const handleSyncScroll = () => {
      if (!containerRef.current || !sidebarRef.current) return;

      const container = containerRef.current;
      const sidebar = sidebarRef.current;
      const { top, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScrollMain = height - viewportHeight;
      const maxScrollSidebar = sidebar.scrollHeight - sidebar.clientHeight;

      if (maxScrollMain <= 0 || maxScrollSidebar <= 0) return;

      let progress = -top / maxScrollMain;
      progress = Math.max(0, Math.min(1, progress));
      sidebar.scrollTop = progress * maxScrollSidebar;
    };

    window.addEventListener("scroll", handleSyncScroll);
    handleSyncScroll();
    window.addEventListener("resize", handleSyncScroll);

    return () => {
      window.removeEventListener("scroll", handleSyncScroll);
      window.removeEventListener("resize", handleSyncScroll);
    };
  }, []);

  // --- SCROLL SPY ---
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observerOptions = {
      root: null,
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

    const sections = document.querySelectorAll(".cs-section");
    sections.forEach((section) => observerRef.current.observe(section));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [project]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  if (!project) return <div className="error-state">Project not found</div>;

  return (
    <article className="case-study">
      <div className="cs-container" ref={containerRef}>
        {/* LEFT SIDE - STICKY SIDEBAR */}
        <aside className="cs-sidebar" ref={sidebarRef}>
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
                        {/* ✅ FIX: Add remarkGfm for better markdown support */}
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw]}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // ✅ Custom components untuk styling
                            p: ({ node, ...props }) => (
                              <p className="markdown-paragraph" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                              <h1 className="markdown-h1" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 className="markdown-h2" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="markdown-h3" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="markdown-list" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="markdown-list ordered"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="markdown-list-item" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="markdown-bold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="markdown-italic" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="markdown-quote"
                                {...props}
                              />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  className="markdown-code-inline"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="markdown-code-block"
                                  {...props}
                                />
                              ),
                            a: ({ node, ...props }) => (
                              <a className="markdown-link" {...props} />
                            ),
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
                  const imgSrc =
                    typeof img === "string" ? img : getStrapiMedia(img);

                  return (
                    <div
                      key={imgIndex}
                      className="cs-image-wrapper"
                      style={{ position: "relative" }}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${section.title} image ${imgIndex + 1}`}
                        width={1200}
                        height={800}
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
