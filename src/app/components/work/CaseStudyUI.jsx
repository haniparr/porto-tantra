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

  // Refs for smooth scrolling (Lerp)
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);

  const credits = Array.isArray(project.credits) ? project.credits : [];

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // --- REFINED SYNC SCROLL (PER-SECTION FOCUS) ---
  useEffect(() => {
    const handleSyncScroll = () => {
      // Find the currently active section in the viewport
      const sections = document.querySelectorAll(".cs-section");
      let currentSection = null;

      // Find the section that covers the middle of the viewport
      const viewportMiddle = window.innerHeight / 2;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          currentSection = section;
        }
      });

      if (!currentSection) return;

      const targetId = currentSection.id;

      // Update active state if changed
      if (activeSectionRef.current !== targetId) {
        setActiveSection(targetId);
      }

      // Now handle the sidebar scroll
      // We want the ACTIVE ITEM in the sidebar to be visible.
      // If the active item is TALLER than the sidebar view, we scroll inside it.

      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      // Find the corresponding Nav Item in sidebar
      // We need to look up by index because we map sections to nav items
      const sectionIndex = project.sections.findIndex((s) => s.id === targetId);
      if (sectionIndex === -1) return;

      const navItems = sidebar.querySelectorAll(".cs-nav-item");
      const activeNavItem = navItems[sectionIndex];

      if (!activeNavItem) return;

      // Calculate progress within the current section (0 to 1)
      const sectionRect = currentSection.getBoundingClientRect();
      const sectionHeight = sectionRect.height;
      // How far have we scrolled into this section?
      // (Starts at 0 when top enters viewport, goes to 1 when bottom leaves)
      // Actually we want progress relative to "reading" flow.
      // Let's us viewport height as the "reader frame".

      const scrolledIntoSection = -sectionRect.top; // pixel scrolled from top
      const scrollableHeight = sectionHeight - window.innerHeight; // max scrollable distance

      let progress = 0;
      if (scrollableHeight > 0) {
        progress = scrolledIntoSection / scrollableHeight;
        progress = Math.max(0, Math.min(1, progress));
      }

      // Calculate target scroll position for sidebar
      // Ideally, the top of the activeNavItem should be near the top (e.g., after the main title)
      // BUT if it's tall, we scroll it up based on progress.

      const sidebarHeight = sidebar.clientHeight;
      const navItemTop = activeNavItem.offsetTop;
      const navItemHeight = activeNavItem.clientHeight;

      // Base target: Center the item or align top with some padding
      // Let's aim to align top with 150px padding (space for title)
      // UNLESS item is tall.

      let targetScrollTop = navItemTop - 150;

      // If we are in the FIRST section, we want to KEEP the main title visible initially.
      // So we shouldn't scroll past 0 unless we really need to (e.g. content is super long).
      if (sectionIndex === 0) {
        // If we are near the top of the page, force 0.
        // Or just clamp the targetScrollTop to be >= 0 (which it naturally is),
        // BUT we specificallly want it to start at 0 and stay 0 for a bit.
        if (progress < 0.1) {
          targetScrollTop = 0;
        } else {
          // Smoothly transition from 0 to the calculated target
          // Maybe just use a smaller offset
          targetScrollTop = Math.min(targetScrollTop, progress * navItemTop);
        }
      }

      // If the item content is taller than the remaining sidebar space...
      // effectively, if navItemHeight > (sidebarHeight - 350), we might need internal scrolling

      const availableSpace = sidebarHeight - 350; // Account for sticky credit block

      if (navItemHeight > availableSpace) {
        // Map the section progress (0-1) to the item's overflow scroll
        const itemOverflow = navItemHeight - availableSpace;
        const additionalScroll = progress * itemOverflow;
        targetScrollTop += additionalScroll;
      }

      // Safety check
      targetScrollTop = Math.max(0, targetScrollTop);

      // --- LERP SMOOTHING ---
      // Instead of scrolling immediately, we update the target.
      // The RAF loop below will handle the actual scrolling.
      targetScrollRef.current = targetScrollTop;
    };

    window.addEventListener("scroll", handleSyncScroll, { passive: true });
    window.addEventListener("resize", handleSyncScroll);

    // Initial call
    handleSyncScroll();

    return () => {
      window.removeEventListener("scroll", handleSyncScroll);
      window.removeEventListener("resize", handleSyncScroll);
    };
  }, [project, activeSection]); // Re-bind when project changes

  // --- RAF LOOP FOR SMOOTH SCROLLING ---
  useEffect(() => {
    let rafId;

    const animateScroll = () => {
      if (!sidebarRef.current) return;

      const target = targetScrollRef.current;
      const current = currentScrollRef.current;

      // Lerp factor (0.1 = smooth/slow, 0.2 = faster)
      // We use a small threshold to stop animating when close enough
      const diff = target - current;

      if (Math.abs(diff) > 0.5) {
        const nextScroll = current + diff * 0.08; // Adjust 0.08 for smoothness
        sidebarRef.current.scrollTop = nextScroll;
        currentScrollRef.current = nextScroll;
        rafId = requestAnimationFrame(animateScroll);
      } else {
        // Snap to exact target when close
        if (current !== target) {
          sidebarRef.current.scrollTop = target;
          currentScrollRef.current = target;
        }
        rafId = requestAnimationFrame(animateScroll);
      }
    };

    rafId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(rafId);
  }, []);

  /* IntersectionObserver removed as scroll handler manages active section efficiently */

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
                            u: ({ node, ...props }) => (
                              <u className="markdown-underline" {...props} />
                            ),
                            del: ({ node, ...props }) => (
                              <del
                                className="markdown-strikethrough"
                                {...props}
                              />
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
