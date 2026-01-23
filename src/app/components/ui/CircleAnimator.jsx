import Image from "next/image";
// Sesuaikan path ini dengan lokasi gambar Anda sebenarnya di folder Next.js
import cardImage from "@/app/assets/card-shape.png";

export default function CircleAnimator() {
  // Setup data items
  const count = 8;
  const items = Array(count).fill(cardImage);
  const radius = 550;
  const angleStep = 360 / count;

  return (
    <div className="circle-animator-container">
      <div className="circle-overlay">
        <h1>Graphic Designer</h1>
      </div>

      <div className="circle-track">
        {items.map((src, index) => {
          const angle = index * angleStep;

          // Style Logic:
          // Rotate wrapper to angle -> Translate out (radius) -> Rotate item to be upright (90deg offset)
          const transformStyle = `rotate(${angle}deg) translate(${radius}px) rotate(90deg)`;

          return (
            <div
              key={index}
              className="circle-item"
              style={{ transform: transformStyle }}
            >
              <div className="circle-item-inner">
                {/* Next Image Notes:
                   - Karena kita import 'cardImage', Next.js otomatis tahu width/height aslinya.
                   - 'placeholder="blur"' opsional jika ingin efek loading blur.
                */}
                <Image
                  src={src}
                  alt={`Work ${index + 1}`}
                  style={{ objectFit: "contain" }}
                  width={200} // Sesuaikan estimasi ukuran visual kartu Anda agar optimal
                  height={300} // Sesuaikan estimasi ukuran visual kartu Anda
                  priority={index < 4} // Prioritaskan loading 4 kartu pertama
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
