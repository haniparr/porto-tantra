"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ParallaxIntro() {
  const containerRef = useRef(null);

  const images = [
    {
      src: "https://images.pexels.com/photos/3052727/pexels-photo-3052727.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.2,
      className: "img-1",
    },
    {
      src: "https://images.pexels.com/photos/3052725/pexels-photo-3052725.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.5,
      className: "img-2",
    },
    {
      src: "https://images.pexels.com/photos/3052728/pexels-photo-3052728.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.3,
      className: "img-3",
    },
    {
      src: "https://images.pexels.com/photos/3052726/pexels-photo-3052726.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.6,
      className: "img-4",
    },
    {
      src: "https://images.pexels.com/photos/3052724/pexels-photo-3052724.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.4,
      className: "img-5",
    },
    // New images
    {
      src: "https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.25,
      className: "img-6",
    },
    {
      src: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.55,
      className: "img-7",
    },
    {
      src: "https://images.pexels.com/photos/3062532/pexels-photo-3062532.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.35,
      className: "img-8",
    },
    {
      src: "https://images.pexels.com/photos/3062553/pexels-photo-3062553.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.65,
      className: "img-9",
    },
    {
      src: "https://images.pexels.com/photos/3062539/pexels-photo-3062539.jpeg?auto=compress&cs=tinysrgb&w=800",
      speed: 0.45,
      className: "img-10",
    },
  ];

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    // Cache elemen wrapper agar tidak querySelector berulang kali saat scroll
    // Kita cari elemen yang punya atribut data-speed
    const imgWrappers = section.querySelectorAll(".parallax-img-wrapper");

    let rafId; // Request Animation Frame ID

    const handleScroll = () => {
      // Gunakan requestAnimationFrame untuk performa 60fps
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const sectionHeight = section.offsetHeight;

        // Optimization: Stop animasi jika section sudah lewat jauh (1.5x tinggi)
        if (scrollY > sectionHeight * 1.5) return;

        imgWrappers.forEach((img) => {
          const speed = parseFloat(img.getAttribute("data-speed"));

          // Logic Parallax: Move up as we scroll down
          const yPos = scrollY * speed * -1;

          // Logic Blur: Start blurring after 100px scroll, max out at 10px
          const blurAmount = Math.min(Math.max((scrollY - 100) / 50, 0), 10);

          // Apply Styles langsung ke DOM (Direct Manipulation) untuk menghindari Re-render React
          img.style.transform = `translate3d(0, ${yPos}px, 0)`;
          img.style.filter = `blur(${blurAmount}px)`;
        });
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="parallax-intro" ref={containerRef}>
      <div className="parallax-content">
        <h1 className="parallax-title">
          <span>TANTRA</span>
          <span>HARIASTAMA</span>
        </h1>
        <p className="parallax-year">1929</p>
      </div>

      <div className="parallax-images">
        {images.map((img, index) => (
          <div
            key={index}
            className={`parallax-img-wrapper ${img.className}`}
            data-speed={img.speed}
          >
            {/* Menggunakan Next/Image. 
              Pastikan parent (.parallax-img-wrapper) di CSS memiliki 'position: relative' 
              atau ukuran pasti agar gambar tidak collapse.
            */}
            <Image
              src={img.src}
              alt="Parallax Element"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
              // Kita beri priority loading karena ini elemen Hero (Above the fold)
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
