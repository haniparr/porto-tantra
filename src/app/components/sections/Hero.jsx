import Link from "next/link";
// Pastikan path import ini sesuai dengan lokasi file CircleAnimator yang sudah kita buat
import CircleAnimator from "@/app/components/ui/CircleAnimator";

// Import CSS khusus Hero
// Sesuaikan path jika folder styles Anda ada di root atau di dalam src
import "../../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Render Komponen Circle Animator */}
      <CircleAnimator />

      <div className="hero-overlay-content">
        <div className="hero-cta-wrapper">
          {/* Menggunakan Link untuk navigasi ke halaman /work.
                   Jika ingin scroll ke section di halaman yang sama, ganti href menjadi "#id-section"
                   dan scroll={false}
                */}
          <Link href="/work" className="btn-primary">
            View Selected Work
          </Link>
        </div>
      </div>
    </section>
  );
}
