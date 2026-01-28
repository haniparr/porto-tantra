import Image from "next/image";
import "@/app/styles/skill-ticker.css";

// Helper Sub-component untuk merender satu baris ticker
function TickerRow({ items, reverse = false }) {
  return (
    <div className={`ticker-track ${reverse ? "reverse" : ""}`}>
      <div className="ticker-content">
        {/* Kita render items DUA KALI untuk menciptakan efek seamless infinite loop.
          Set 1: Original
        */}
        {items.map((item, index) => (
          <div key={`original-${index}`} className="ticker-item">
            <div className="ticker-image-wrapper">
              <Image
                src={item.image}
                alt={item.label}
                width={50}
                height={50}
                className="ticker-image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {item.label}
          </div>
        ))}

        {/* Set 2: Duplicate (untuk loop) */}
        {items.map((item, index) => (
          <div key={`duplicate-${index}`} className="ticker-item">
            <div className="ticker-image-wrapper">
              <Image
                src={item.image}
                alt={item.label}
                width={50}
                height={50}
                className="ticker-image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillTicker() {
  const row1 = [
    {
      label: "App Design",
      image: "/assets/skill-ticker/AppDesign.png",
    },
    {
      label: "Brand Identity",
      image: "/assets/skill-ticker/BrandIdentity.png",
    },
    {
      label: "Graphic Design",
      image: "/assets/skill-ticker/GraphicDesign.png",
    },
    {
      label: "Illustration",
      image: "/assets/skill-ticker/Illustration.png",
    },
    {
      label: "Marketing Content",
      image: "/assets/skill-ticker/MarketingContent.png",
    },
    {
      label: "Motion Graphic",
      image: "/assets/skill-ticker/MotionGraphic.png",
    },
    {
      label: "Web Design",
      image: "/assets/skill-ticker/MotionGraphic.png",
    },
  ];

  const row2 = [
    {
      label: "Web Design",
      image: "/assets/skill-ticker/MotionGraphic.png",
    },
    {
      label: "Motion Graphic",
      image: "/assets/skill-ticker/MotionGraphic.png",
    },
    {
      label: "Marketing Content",
      image: "/assets/skill-ticker/MarketingContent.png",
    },
    {
      label: "Illustration",
      image: "/assets/skill-ticker/Illustration.png",
    },
    {
      label: "Graphic Design",
      image: "/assets/skill-ticker/GraphicDesign.png",
    },
    {
      label: "Brand Identity",
      image: "/assets/skill-ticker/BrandIdentity.png",
    },
    {
      label: "App Design",
      image: "/assets/skill-ticker/AppDesign.png",
    },
  ];

  return (
    <section className="skill-ticker-section">
      <div className="ticker-wrapper">
        <TickerRow items={row1} />
        <TickerRow items={row2} reverse={true} />
      </div>
    </section>
  );
}
