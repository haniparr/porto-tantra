"use client";

import { useEffect, useRef } from "react";
import { AsciiImage } from "./../ui/AsciiImage";
import AnimatedHeading from "./../ui/AnimatedHeading";
import gsap from "gsap";

// Image configuration with dimensions for ASCII rendering
const imageConfig = [
  {
    src: "/assets/HummingBird1.webm",
    speed: 0.3,
    className: "img-1",
    width: 350,
    height: 350,
    contrast: 1.2,
  },
  {
    src: "/assets/HummingBird2.webm",
    speed: 0.5,
    className: "img-2",
    width: 350,
    height: 350,
    contrast: 1.1,
  },
  {
    src: "/assets/HummingBird3.webm",
    speed: 0.2,
    className: "img-3",
    width: 250,
    height: 250,
    contrast: 1.3,
  },
  {
    src: "/assets/HummingBird4.webm",
    speed: 0.6,
    className: "img-4",
    width: 300,
    height: 300,
    contrast: 1.3,
  },
  {
    src: "/assets/HummingBird5.webm",
    speed: 0.4,
    className: "img-5",
    width: 320,
    height: 320,
    contrast: 1.2,
  },
  {
    src: "/assets/HummingBird1.webm",
    speed: 0.35,
    className: "img-6",
    width: 350,
    height: 350,
    contrast: 1.2,
  },
];

export default function ParallaxIntro() {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const floatingRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const scrollY = window.scrollY;
      const sectionHeight = section.offsetHeight;

      // Only animate if within view
      if (scrollY > sectionHeight * 1.5) return;

      imagesRef.current.forEach((img) => {
        if (!img) return;
        const speed = parseFloat(img.getAttribute("data-speed"));
        const yPos = scrollY * speed * -1;
        img.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial positions on mount

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 2;
      const yPos = (clientY / innerHeight - 0.5) * 2;

      floatingRef.current.forEach((el, index) => {
        if (!el) return;
        const speed = ((index % 5) + 1) * 15; // Varying intensity
        const rotationSpeed = ((index % 3) + 1) * 2;

        gsap.to(el, {
          x: xPos * speed,
          y: yPos * speed,
          rotateX: yPos * -rotationSpeed,
          rotateY: xPos * rotationSpeed,
          duration: 1.5,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="parallax-intro" ref={sectionRef}>
      <div className="parallax-content">
        <AnimatedHeading text="TANTRA HARIASTAMA" className="parallax-title" />
        <AnimatedHeading text="1929" className="parallax-year" />
      </div>

      <div className="parallax-images">
        {imageConfig.map((img, index) => (
          <div
            key={index}
            ref={(el) => (imagesRef.current[index] = el)}
            className={`parallax-img-wrapper ${img.className}`}
            data-speed={img.speed}
            style={{ perspective: "1000px" }}
          >
            <div
              ref={(el) => (floatingRef.current[index] = el)}
              className="parallax-floating-inner"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="ascii-mount">
                <AsciiImage
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  enableColor={false}
                  cellSize={4}
                  objectFit="cover"
                  contrast={img.contrast || 1.0}
                  brightness={img.brightness || 0.0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
