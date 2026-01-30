import { AsciiImage } from "./AsciiImage";

export default function CircleAnimator() {
  // Setup data items
  const count = 8;
  const videoSrc = "/assets/Watchtower.webm";
  const items = Array(count).fill(videoSrc);
  const radius = 500;
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
                <AsciiImage
                  src={src}
                  width={132}
                  height={176}
                  cellSize={6}
                  enableColor={false}
                  densePreset={true}
                  className="circle-ascii"
                  maxDuration={5}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
