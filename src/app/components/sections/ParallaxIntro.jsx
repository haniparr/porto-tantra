"use client";

import { useEffect, useRef } from "react";
import { AsciiImage } from "./../ui/AsciiImage";
import AnimatedHeading from "./../ui/AnimatedHeading"; // Import AnimatedHeading

// Image configuration with dimensions for ASCII rendering
const imageConfig = [
  {
    src: "/assets/video-1.mp4",
    speed: 0.2,
    className: "img-1",
    width: 350,
    height: 450,
  }, // Video
  {
    src: "/assets/project-preview.jpg",
    speed: 0.5,
    className: "img-2",
    width: 400,
    height: 500,
  },
  {
    src: "https://images.pexels.com/photos/3052728/pexels-photo-3052728.jpeg?auto=compress&cs=tinysrgb&w=800",
    speed: 0.3,
    className: "img-3",
    width: 300,
    height: 350,
  },
  {
    src: "/assets/video-2.mp4",
    speed: 0.6,
    className: "img-4",
    width: 380,
    height: 280,
  }, // Video
  {
    src: "https://images.pexels.com/photos/3052724/pexels-photo-3052724.jpeg?auto=compress&cs=tinysrgb&w=800",
    speed: 0.4,
    className: "img-5",
    width: 250,
    height: 300,
  },
  {
    src: "/assets/project-preview.jpg",
    speed: 0.25,
    className: "img-6",
    width: 400,
    height: 300,
  },
  {
    src: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
    speed: 0.55,
    className: "img-7",
    width: 350,
    height: 450,
  },
  {
    src: "/assets/video-3.mp4",
    speed: 0.35,
    className: "img-8",
    width: 300,
    height: 400,
  }, // Video
  {
    src: "/assets/project-preview.jpg",
    speed: 0.65,
    className: "img-9",
    width: 320,
    height: 250,
  },
  {
    src: "https://images.pexels.com/photos/3062539/pexels-photo-3062539.jpeg?auto=compress&cs=tinysrgb&w=800",
    speed: 0.45,
    className: "img-10",
    width: 200,
    height: 200,
  },
];

export default function ParallaxIntro() {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);

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
    return () => window.removeEventListener("scroll", handleScroll);
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
          >
            <div className="ascii-mount">
              <AsciiImage
                src={img.src}
                width={img.width}
                height={img.height}
                enableColor={true}
                cellSize={4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
