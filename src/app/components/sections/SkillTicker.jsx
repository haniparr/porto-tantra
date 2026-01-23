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
            <div className="ticker-placeholder"></div>
            {item}
          </div>
        ))}

        {/* Set 2: Duplicate (untuk loop) */}
        {items.map((item, index) => (
          <div key={`duplicate-${index}`} className="ticker-item">
            <div className="ticker-placeholder"></div>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillTicker() {
  const row1 = [
    "Development",
    "UI/UX Design",
    "E-commerce",
    "Product Design",
    "Development",
    "UI/UX Design",
    "E-commerce",
    "Product Design",
    "Development",
    "UI/UX Design",
    "E-commerce",
    "Product Design",
  ];

  const row2 = [
    "Packaging",
    "Art Direction",
    "Content",
    "Brand Identity",
    "Packaging",
    "Art Direction",
    "Content",
    "Brand Identity",
    "Packaging",
    "Art Direction",
    "Content",
    "Brand Identity",
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
