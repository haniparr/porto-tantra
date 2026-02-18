"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "../ui/Typewriter";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const mainWrapper = document.getElementById("main-wrapper");

    if (!footer || !mainWrapper) return;

    const updateFooterState = () => {
      const footerHeight = footer.offsetHeight;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Matikan efek reveal di layar lebar < 2000px dan mobile
      const disableReveal = windowWidth < 2000;

      if (disableReveal) {
        // Mode normal tanpa reveal effect
        footer.style.position = "relative";
        footer.style.zIndex = "2";
        mainWrapper.style.marginBottom = "0px";
      } else {
        // Desktop (> 2000px): Terapkan logika reveal jika cukup tinggi
        if (windowHeight < footerHeight) {
          // Viewport lebih kecil dari footer, gunakan mode normal agar tidak terpotong
          footer.style.position = "relative";
          footer.style.zIndex = "2";
          mainWrapper.style.marginBottom = "0px";
        } else {
          // Reveal effect active
          footer.style.position = "fixed";
          footer.style.zIndex = "0";
          footer.style.bottom = "0";
          footer.style.left = "0";
          footer.style.width = "100%";
          mainWrapper.style.marginBottom = `${footerHeight}px`;
        }
      }
    };

    // Jalankan saat mount
    requestAnimationFrame(updateFooterState);

    // Observe footer
    const resizeObserver = new ResizeObserver(updateFooterState);
    resizeObserver.observe(footer);

    // Jalankan saat resize window
    window.addEventListener("resize", updateFooterState);

    // Cleanup saat unmount
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFooterState);
      if (mainWrapper) mainWrapper.style.marginBottom = "0px";
    };
  }, []);

  // Kata-kata untuk Typewriter
  const typewriterWords = [
    "branding project",
    "website design project",
    "logo design project",
    "Illustration Project",
    "Full time design position",
    "motion graphic project",
    "Framer website project",
  ];

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-content">
        {/* Top Section */}
        <div className="footer-top">
          <div className="cta-section">
            <h2 className="footer-cta-text">
              Have a <Typewriter words={typewriterWords} />?<br />
              Whether you have a clear roadmap or just a rough idea, I&rsquo;m
              here to help you.
            </h2>
            <a
              href="mailto:witantrahariastama@gmail.com"
              className="btn-footer"
            >
              <span>↳ Let's Collaborate</span>
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-middle">
          <div className="footer-tagline">
            <h3>
              Simplicity Creates
              <br />
              Clarity
            </h3>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Office</h4>
              <p>Yogyakarta, Indonesia</p>
            </div>

            <div className="footer-col">
              <h4>Sitemap</h4>
              <ul>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/work">Work</Link>
                </li>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Follow Us</h4>
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Behance
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Twitter / X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="big-text">
            <Image
              src="/footer-logo.svg"
              alt="Creative Strategist"
              className="footer-logo-img"
              width={800}
              height={150}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
