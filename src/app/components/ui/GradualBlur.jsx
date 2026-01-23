export default function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "120px",
  divCount = 8,
  zIndex = 50,
}) {
  // Tentukan arah gradient berdasarkan posisi
  const direction = position === "bottom" ? "to bottom" : "to top";

  // Buat Array kosong sepanjang divCount untuk diloop
  const layers = Array.from({ length: divCount }, (_, index) => {
    const i = index + 1; // Logic asli dimulai dari 1

    // Kalkulasi Blur Amount (Kurva eksponensial agar terlihat natural)
    const blurAmount = (Math.pow(i, 2) / Math.pow(divCount, 2)) * strength;

    // Kalkulasi Masking Band (Logic "Pita" Transparansi)
    const increment = 100 / divCount;
    const p1 = (increment * i - increment).toFixed(1);
    const p2 = (increment * i).toFixed(1);
    const p3 = (increment * i + increment).toFixed(1);
    const p4 = (increment * i + increment * 2).toFixed(1);

    // Susun string gradient
    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (parseFloat(p3) <= 100) gradient += `, black ${p3}%`;
    if (parseFloat(p4) <= 100) gradient += `, transparent ${p4}%`;

    const maskImage = `linear-gradient(${direction}, ${gradient})`;

    return {
      key: i,
      style: {
        position: "absolute",
        inset: 0,
        maskImage: maskImage,
        WebkitMaskImage: maskImage, // Vendor prefix untuk Safari/Chrome lama
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      },
    };
  });

  return (
    <div
      className={`gradual-blur gradual-blur-${position}`}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        [position]: 0, // dynamic key: top: 0 atau bottom: 0
        height: height,
        zIndex: zIndex,
        pointerEvents: "none", // PENTING: Agar bisa klik tembus ke elemen di belakangnya
        overflow: "hidden",
      }}
    >
      {layers.map((layer) => (
        <div key={layer.key} style={layer.style} />
      ))}
    </div>
  );
}
