"use client";

import { useEffect, useRef } from "react";

export default function WorkExperience({ experiences = [] }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || cards.length === 0) return;

    // 1. Intersection Observer untuk Fade In
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => {
      if (card) observer.observe(card);
    });

    // 2. Scroll Event untuk Stacking Effect
    const handleScroll = () => {
      const stickyTop = 150; // Jarak dari atas (sesuai CSS original)
      const viewportHeight = window.innerHeight;

      cards.forEach((card, index) => {
        // Skip item terakhir (tidak perlu mengecil)
        if (index === cards.length - 1) return;

        const nextCard = cards[index + 1];
        if (!nextCard) return;

        const nextCardTop = nextCard.getBoundingClientRect().top;

        // Hitung jarak
        const dist = nextCardTop - stickyTop;
        const maxDist = viewportHeight - stickyTop;

        // Normalize progress (0 sampai 1)
        let progress = Math.min(1, Math.max(0, dist / maxDist));

        // Efek Visual
        // Jika nextCard sudah dekat, card sekarang mengecil dan memudar
        const scale = 0.95 + 0.05 * progress;
        const opacity = 0.5 + 0.5 * progress;
        const brightness = 0.5 + 0.5 * progress;

        // Apply style langsung ke DOM
        if (card && card.getBoundingClientRect().top <= stickyTop + 10) {
          card.style.transform = `scale(${scale})`;
          card.style.opacity = progress < 0.1 ? 0 : opacity;
          card.style.filter = `brightness(${brightness})`;
        } else if (card) {
          // Reset
          card.style.transform = "translateY(0) scale(1)";
          card.style.opacity = "1";
          card.style.filter = "brightness(1)";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      className="work-experience-section"
      id="work-experience-section"
      ref={sectionRef}
    >
      <div className="section-layout">
        <div className="section-label">
          <span>[ WORK EXPERIENCE ]</span>
        </div>
        <div className="experience-entries">
          {experiences.map((item, index) => (
            <article
              key={item.id || index}
              className="experience-entry"
              data-index={index}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="entry-header">
                <div className="entry-logo-box">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                    <path d="M7 7h10v10H7z"></path>
                  </svg>
                </div>
                <h3 className="entry-title">{item.company}</h3>
              </div>

              <div className="entry-footer">
                <div className="entry-meta">
                  <span className="entry-role">{item.role}</span>
                  <span className="entry-year">{item.year}</span>
                </div>
                <div className="entry-achievements-wrapper">
                  <p className="entry-achievements">{item.achievements}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
