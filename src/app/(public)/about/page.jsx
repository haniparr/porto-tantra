import Image from "next/image";
import { getTestimonials } from "@/app/lib/api";
import { prisma } from "@/app/lib/prisma";
import "@/app/styles/services.css"; // Kita reuse style services karena layoutnya sama

// Import Components
import WorkExperience from "@/app/components/sections/WorkExperience";
import FAQ from "@/app/components/sections/FAQ";
import TestimonialsSlider from "@/app/components/sections/TestimonialsSlider";
import GradientWrapper from "@/app/components/ui/GradientWrapper";

export const metadata = {
  title: "About - Tantra Hariastama",
  description: "Learn more about my background, experience, and services.",
};

export default async function AboutPage() {
  // Fetch testimonials data
  let testimonialsData = [];
  try {
    const res = await getTestimonials();
    if (res && res.data) {
      testimonialsData = res.data;
    }
  } catch (e) {
    console.warn("API Error (About/Testimonials):", e.message);
  }

  // Fetch work experiences data
  let experiencesData = [];
  try {
    experiencesData = await prisma.workExperience.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.warn("DB Error (About/WorkExperience):", e.message);
  }

  // Fetch clients data
  let clientsData = [];
  try {
    clientsData = await prisma.client.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.warn("DB Error (About/Clients):", e.message);
  }

  return (
    <div className="services-page">
      <GradientWrapper className="min-h-screen">
        {/* Intro Section */}
        <section
          className="services-intro"
          style={{ paddingTop: "clamp(100px, 15vh, 120px)" }}
        >
          <div className="section-layout">
            <div className="section-label">
              <span>[ ABOUT & SERVICES ]</span>
            </div>
            <div className="intro-content">
              <div className="intro-image-box">
                <Image
                  src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3"
                  alt="Profile"
                  className="intro-placeholder-img"
                  width={400}
                  height={300}
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <h1 className="intro-headline">
                I bring the discipline of Graphic Design to the craft of visual
                communication. With over 5 years of experience across the US and
                Singapore, I translate complex business goals into clear,
                scalable design systems.
              </h1>

              {/* Services Grid */}
              <div className="intro-features-grid">
                <div className="service-card">
                  <div className="card-header">
                    <span className="service-number">01</span>
                  </div>
                  <div className="card-content">
                    <h3 className="service-title">Visual Identity</h3>
                    <p className="service-description">
                      Logos, typography, and color systems that tell your
                      brand's story.
                    </p>
                  </div>
                </div>
                <div className="service-card">
                  <div className="card-header">
                    <span className="service-number">02</span>
                  </div>
                  <div className="card-content">
                    <h3 className="service-title">Digital Design</h3>
                    <p className="service-description">
                      Websites and social assets that engage and convert.
                    </p>
                  </div>
                </div>
                <div className="service-card">
                  <div className="card-header">
                    <span className="service-number">03</span>
                  </div>
                  <div className="card-content">
                    <h3 className="service-title">Art Direction</h3>
                    <p className="service-description">
                      Guiding the visual narrative across all platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Section (Interactive) */}
        <WorkExperience experiences={experiencesData} />

        {/* Clients Section */}
        <section className="clients-section">
          <div className="section-layout">
            <div className="section-label">
              <span>[ CLIENTS ]</span>
            </div>
            <div className="clients-grid">
              {clientsData.map((client) => (
                <div key={client.id} className="client-logo-item relative">
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="client-logo grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain p-8"
                    />
                  ) : (
                    <span className="client-text font-bold text-gray-400">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Slider */}
        <TestimonialsSlider initialData={testimonialsData} />

        {/* FAQ Section */}
        <FAQ />
      </GradientWrapper>
    </div>
  );
}
