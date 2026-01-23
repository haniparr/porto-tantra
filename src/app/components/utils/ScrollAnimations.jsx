"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollAnimations() {
  const pathname = usePathname(); // Hook untuk mendeteksi perubahan URL

  useEffect(() => {
    // 1. Setup Observer Options
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    // 2. Define Callback
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target); // Stop observing setelah animasi jalan
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // 3. Logic Seleksi Elemen
    // Kita bungkus dalam setTimeout kecil agar menunggu React selesai render DOM halaman baru
    const initAnimations = () => {
      const selectors = [
        ".project-card",
        ".cs-section",
        ".hero-content > *",
        ".hero-visual",
        // Tambahkan selector lain jika perlu
        ".work-card",
        ".blog-card",
        ".insight-card",
      ];

      const elements = document.querySelectorAll(selectors.join(", "));

      elements.forEach((el) => {
        // Cek agar tidak menambah class double atau meng-observe ulang elemen yg sudah tampil
        if (!el.classList.contains("animate-in")) {
          el.classList.add("fade-up-element"); // Set initial state (opacity 0 / translate down)
          observer.observe(el);
        }
      });
    };

    // Jalankan inisialisasi
    initAnimations();

    // Cleanup saat unmount atau pindah halaman
    return () => {
      observer.disconnect();
    };
  }, [pathname]); // PENTING: Effect ini akan jalan ulang setiap kali pathname berubah

  // Komponen ini tidak merender UI apa-apa, hanya logic
  return null;
}
