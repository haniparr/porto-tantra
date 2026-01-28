"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Opsional: untuk styling menu aktif

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Definisi Menu Items agar kode lebih rapi dan DRY (Don't Repeat Yourself)
  const menuItems = [
    { label: "Home", href: "/", type: "internal" },
    { label: "Work", href: "/work", type: "internal" }, // Asumsi route /work
    { label: "About", href: "/about", type: "internal" }, // Asumsi route /about
    { label: "Blog", href: "/blog", type: "internal" },
    { label: "Contact", href: "/contact", type: "internal" }, // Asumsi route /contact
    {
      label: "Resume",
      href: "/assets/Witantra_Hariastama_ATS_Resume_Latest.pdf",
      type: "download",
    },
  ];

  return (
    // Tambahkan class 'open' jika state isOpen === true
    <div
      className={`staggered-menu-wrapper fixed-wrapper ${isOpen ? "open" : ""}`}
    >
      {/* Header */}
      <header className="staggered-menu-header">
        <Link href="/" className="sm-logo" onClick={closeMenu}>
          <Image
            src="/Namelogo_white.svg"
            alt="CREATIVE STRATEGIST"
            width={200}
            height={50}
            priority
          />
        </Link>
        <button
          className="sm-toggle"
          aria-label="Toggle Menu"
          onClick={toggleMenu}
        >
          <span className="sm-toggle-text">{isOpen ? "Close" : "Menu"}</span>
          <span className="sm-icon">
            <span className="sm-icon-line"></span>
            <span className="sm-icon-line"></span>
          </span>
        </button>
      </header>

      {/* Backdrop (Klik untuk tutup) */}
      <div className="sm-backdrop" onClick={closeMenu}></div>

      {/* Menu Panel */}
      <div className="staggered-menu-panel">
        <div className="sm-panel-inner">
          <div className="sm-panel-logo">
            {/* Menggunakan Next Image, tapi class tetap dari CSS lama */}
            <Image
              src="/assets/logo-navbar.png"
              alt="Logo"
              className="sm-logo-image"
              width={160} // Sesuaikan estimasi lebar logo Anda
              height={60} // Sesuaikan estimasi tinggi logo Anda
              style={{ width: "auto", height: "auto" }} // Jaga aspek rasio
              priority // Load prioritas tinggi untuk LCP
            />
          </div>

          <nav>
            <ul className="sm-panel-list" data-numbering="true">
              {menuItems.map((item, index) => {
                // Logika Stagger Animation
                // Jika menu terbuka, hitung delay. Jika tertutup, reset ke 0s.
                const transitionDelay = isOpen ? `${0.2 + index * 0.1}s` : "0s";
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    {item.type === "download" ? (
                      // Link Download (External/Asset)
                      <a
                        href={item.href}
                        className="sm-panel-item"
                        data-index={index}
                        download
                        onClick={closeMenu}
                        style={{ transitionDelay }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      // Link Internal (Next.js)
                      <Link
                        href={item.href}
                        className={`sm-panel-item ${isActive ? "active" : ""}`}
                        data-index={index}
                        onClick={closeMenu}
                        style={{ transitionDelay }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sm-socials">
            <h3 className="sm-socials-title">Connect</h3>
            <ul className="sm-socials-list">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
