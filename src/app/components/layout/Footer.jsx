"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "../ui/Typewriter";

export default function Footer() {
  const footerTopRef = useRef(null);
  const footerBottomRef = useRef(null);

  // --- LOGIC: TWO-PART FOOTER REVEAL EFFECT ---
  useEffect(() => {
    const footerTop = footerTopRef.current;
    const footerBottom = footerBottomRef.current;
    const mainWrapper = document.getElementById("main-wrapper");

    if (!footerTop || !footerBottom || !mainWrapper) return;

    const updateFooterState = () => {
      const footerTopHeight = footerTop.offsetHeight;
      const footerBottomHeight = footerBottom.offsetHeight;
      const totalFooterHeight = footerTopHeight + footerBottomHeight;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Matikan efek reveal di mobile
      const isMobile = windowWidth < 1024;

      if (isMobile) {
        // Mode normal tanpa reveal effect di mobile
        footerTop.style.position = "relative";
        footerTop.style.zIndex = "2";
        footerTop.style.marginBottom = "0";
        footerBottom.style.position = "relative";
        footerBottom.style.zIndex = "2";
        mainWrapper.style.marginBottom = "0px";
      } else {
        // Desktop: Terapkan logika reveal berdasarkan tinggi viewport
        if (windowHeight < totalFooterHeight) {
          // Viewport lebih kecil dari total footer
          // Footer Top: mode normal (tidak fixed), tetap di bawah konten
          footerTop.style.position = "relative";
          footerTop.style.zIndex = "2";
          // Beri margin-bottom pada footer-top untuk memberi ruang bagi footer-bottom yang fixed
          footerTop.style.marginBottom = `${footerBottomHeight}px`;

          // Footer Bottom: reveal effect
          footerBottom.style.position = "fixed";
          footerBottom.style.zIndex = "0";
          footerBottom.style.bottom = "0";
          footerBottom.style.left = "0";
          footerBottom.style.width = "100%";

          // TIDAK perlu margin-bottom di main-wrapper karena footer-top sudah di normal flow
          mainWrapper.style.marginBottom = "0px";
        } else {
          // Viewport cukup besar untuk menampung seluruh footer
          // Kedua bagian footer menggunakan reveal effect

          // Footer Top: fixed di bawah
          footerTop.style.position = "fixed";
          footerTop.style.zIndex = "0";
          footerTop.style.bottom = `${footerBottomHeight}px`; // Di atas footer bottom
          footerTop.style.left = "0";
          footerTop.style.width = "100%";
          footerTop.style.marginBottom = "0";

          // Footer Bottom: fixed di paling bawah
          footerBottom.style.position = "fixed";
          footerBottom.style.zIndex = "0";
          footerBottom.style.bottom = "0";
          footerBottom.style.left = "0";
          footerBottom.style.width = "100%";

          // Margin bottom untuk total tinggi footer
          mainWrapper.style.marginBottom = `${totalFooterHeight}px`;
        }
      }
    };

    // Jalankan saat mount
    requestAnimationFrame(updateFooterState);

    // Observe kedua bagian footer
    const resizeObserver = new ResizeObserver(updateFooterState);
    resizeObserver.observe(footerTop);
    resizeObserver.observe(footerBottom);

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
    <>
      {/* Footer Part 1: Top Section */}
      <footer className="site-footer footer-part-top" ref={footerTopRef}>
        <div className="footer-content">
          <div className="footer-top">
            <div className="cta-section">
              <h2 className="footer-cta-text">
                Have a <Typewriter words={typewriterWords} />?<br />
                Whether you have a clear roadmap or just a rough idea, I&rsquo;m
                here to help you.
              </h2>
              <a href="mailto:hello@example.com" className="btn-footer">
                <span>↳ Let's Collaborate</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Part 2: Middle & Bottom Sections */}
      <footer className="site-footer footer-part-bottom" ref={footerBottomRef}>
        <div className="footer-content">
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
    </>
  );
}
