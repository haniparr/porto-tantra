import Image from "next/image";
import "@/app/styles/services.css"; // Import CSS Services

// Import Client Components
import WorkExperience from "@/app/components/sections/WorkExperience";
import FAQ from "@/app/components/sections/FAQ";
import TestimonialsSlider from "@/app/components/sections/TestimonialsSlider"; // Kita buat slider terpisah di bawah

// Import API and DB
import { getTestimonials } from "@/app/lib/api";
import { prisma } from "@/app/lib/prisma";

export const metadata = {
  title: "Services & Experience",
  description: "Design services, work experience, and client testimonials.",
};

export default async function ServicesPage() {
  // Fetch testimonials (Server Side)
  // Jika API belum ada, gunakan array kosong agar fallback placeholder muncul
  let testimonialsData = [];

  // 1. TRY CATCH BLOCK
  try {
    // Uncomment baris ini jika API sudah siap
    const res = await getTestimonials();
    if (res && res.data) {
      testimonialsData = res.data;
    }
  } catch (e) {
    console.warn("API Error (Services):", e.message);
    // Biarkan array kosong, TestimonialsSlider akan otomatis pakai placeholder
  }

  // Fetch work experiences data
  let experiencesData = [];
  try {
    experiencesData = await prisma.workExperience.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.warn("DB Error (Services/WorkExperience):", e.message);
  }

  // Fetch clients data
  let clientsData = [];
  try {
    clientsData = await prisma.client.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.warn("DB Error (Services/Clients):", e.message);
  }

  return (
    <div className="services-page">
      {/* Intro / Services Section */}
      <section
        className="services-intro"
        style={{ paddingTop: "clamp(100px, 15vh, 120px)" }}
      >
        <div className="section-layout">
          <div className="section-label">
            <span>[ SERVICES ]</span>
          </div>
          <div className="intro-content">
            <div className="intro-image-box">
              <Image
                src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3"
                alt="Creative Placeholder"
                className="intro-placeholder-img"
                width={400}
                height={300}
                style={{ objectFit: "cover" }}
              />
            </div>
            <h1 className="intro-headline">
              I bring the discipline of a Graphic Design to the craft of visual
              communication. With over 5 years of experience across the US and
              Singapore, I translate complex business goals into clear, scalable
              design systems. No guesswork, just precision.
            </h1>

            <div className="intro-features-grid">
              <div className="service-card">
                <div className="card-header">
                  <span className="service-number">01</span>
                </div>
                <div className="card-content">
                  <h3 className="service-title">Cross-Disciplinary Skillset</h3>
                  <p className="service-description">
                    From UI design to motion graphics, I handle the entire
                    visual ecosystem. You get a cohesive brand language without
                    managing three different specialists.
                  </p>
                </div>
              </div>
              <div className="service-card">
                <div className="card-header">
                  <span className="service-number">02</span>
                </div>
                <div className="card-content">
                  <h3 className="service-title">Timezone Agnostic</h3>
                  <p className="service-description">
                    Distance is not a barrier. I offer flexible availability to
                    match your working hours, ensuring that we are always in
                    sync, no matter where your HQ is located.
                  </p>
                </div>
              </div>
              <div className="service-card">
                <div className="card-header">
                  <span className="service-number">03</span>
                </div>
                <div className="card-content">
                  <h3 className="service-title">Direct Strategic Access</h3>
                  <p className="service-description">
                    I don&apos;t just push pixels; I try to solve problems. I
                    align every design decision with your business goals to
                    ensure the work actually performs, not just looks good.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section (Client Component) */}
      <WorkExperience experiences={experiencesData} />

      {/* Clients Section (Dynamic) */}
      <section className="clients-section">
        <div className="section-layout">
          <div className="section-label">
            <span>[ CLIENTS ]</span>
          </div>
          <div className="clients-grid">
            {clientsData.map((client) => (
              <div key={client.id} className="client-logo-item">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={60}
                    className="client-logo grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain"
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

      {/* Testimonials Section (Client Component for Slider) */}
      <TestimonialsSlider initialData={testimonialsData} />

      {/* FAQ Section (Client Component) */}
      <FAQ />
    </div>
  );
}
