import Link from "next/link";
import "@/app/styles/about.css";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading"; // Import komponen animasi

export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-layout">
          {/* Label Area */}
          <div className="about-label">
            <span>[ ABOUT ME ]</span>
          </div>

          {/* Content Area */}
          <div className="about-content">
            {/* <div className="about-media-grid">
              <div className="media-placeholder video-placeholder">
                <span>Video Placeholder</span>
              </div>
            </div> */}

            {/* Quote / Headline */}
            <div
              className="quote-box"
              style={{ marginTop: "var(--spacing-md)" }}
            >
              {/* Kita gunakan H1 sebagai container styling, tapi isinya kita pecah */}
              <h1>
                {/* Bagian 1: Bold Text */}
                <strong style={{ display: "inline-block" }}>
                  <AnimatedHeading
                    text="Design is translation, not decoration."
                    as="span" // Render sebagai span agar valid di dalam H1
                  />
                </strong>

                <br />

                {/* Bagian 2: Normal Text */}
                <AnimatedHeading
                  text="I turn complex ideas into clear visual language."
                  as="span"
                />
              </h1>
            </div>

            {/* Description Text */}
            <div className="about-description">
              <p>
                <strong>
                  There is often a disconnect between what a business wants to
                  say and what a user actually hears. That gap is where I live.
                  It&rsquo;s not enough to just master the tools or manage the
                  pixels.
                </strong>
                <br />
                The real work is understanding the nuance, the empathy behind
                the click. From local startups in Indonesia to global tech
                brands, I help brands stop talking at their customers and start
                speaking with them through visual communication.
              </p>

              {/* CTA Button */}
              <div
                className="about-cta"
                style={{ marginTop: "var(--spacing-md)" }}
              >
                <Link href="/contact" className="btn-primary">
                  Let's Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
