"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Typewriter from "../ui/Typewriter"; // Pastikan path ini sesuai dengan file Typewriter.jsx

export default function Footer() {
  const footerRef = useRef(null);

  // --- LOGIC: FOOTER REVEAL EFFECT ---
  useEffect(() => {
    const footer = footerRef.current;
    // PENTING: Pastikan elemen dengan ID 'main-wrapper' ada di app/layout.jsx
    const mainWrapper = document.getElementById("main-wrapper");

    if (!footer || !mainWrapper) return;

    const updateFooterState = () => {
      const footerHeight = footer.offsetHeight;
      const windowHeight = window.innerHeight;

      // Logic asli: Jika footer lebih tinggi dari layar (misal di HP), matikan efek reveal
      if (footerHeight > windowHeight) {
        footer.style.position = "relative";
        footer.style.zIndex = "2";
        mainWrapper.style.marginBottom = "0px";
      } else {
        // Aktifkan Reveal Effect
        footer.style.position = "fixed";
        footer.style.zIndex = "0"; // Footer di layer paling bawah
        footer.style.bottom = "0";
        footer.style.left = "0";
        footer.style.width = "100%";

        // Dorong konten utama ke atas seukuran tinggi footer
        mainWrapper.style.marginBottom = `${footerHeight}px`;
      }
    };

    // Jalankan saat mount
    requestAnimationFrame(updateFooterState);

    // Jalankan saat resize elemen footer
    const resizeObserver = new ResizeObserver(updateFooterState);
    resizeObserver.observe(footer);

    // Jalankan saat resize window
    window.addEventListener("resize", updateFooterState);

    // Cleanup saat unmount
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFooterState);
      // Reset style agar tidak mengganggu halaman lain jika komponen di-unmount
      if (mainWrapper) mainWrapper.style.marginBottom = "0px";
    };
  }, []);

  // Kata-kata untuk Typewriter (diambil dari typewriter.js lama)
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
            <a href="mailto:hello@example.com" className="btn-footer">
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
              <p>Jakarta, Indonesia</p>
              <p>South Quarter, Tower A</p>
              <p>Jl. R.A. Kartini Kav 8</p>
            </div>

            <div className="footer-col">
              <h4>Sitemap</h4>
              <ul>
                {/* Gunakan Link Next.js untuk navigasi internal */}
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
          <div className="copyright">
            <p>Copyright © 2024 Creative Strategist</p>
          </div>
          <div className="big-text">
            {/* Next.js Image membutuhkan width/height untuk mencegah Layout Shift.
               CSS Anda (.footer-logo-img) akan tetap mengontrol ukuran visualnya.
               Pastikan file footer-logo.svg ada di folder public/ 
            */}
            <Image
              src="/assets/footer-logo.svg"
              alt="Creative Strategist"
              className="footer-logo-img"
              width={800}
              height={150}
              style={{ width: "auto", height: "auto" }} // Menjaga aspek rasio
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
