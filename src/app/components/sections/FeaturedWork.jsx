import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import { getHardcodedProjects } from "@/app/lib/dummy-data";

export default async function FeaturedWork() {
  // ✅ LOGIC SAMA DENGAN VITE: Try API first, fallback to hardcoded
  let works = [];

  try {
    const response = await getProjects(true); // featured = true
    if (response && response.data && response.data.length > 0) {
      works = response.data;
      console.log("✅ Using Strapi data for FeaturedWork");
    } else {
      works = getHardcodedProjects();
      console.log("⚠️ Using hardcoded data for FeaturedWork (no Strapi data)");
    }
  } catch (error) {
    console.warn(
      "API Error in FeaturedWork, using hardcoded data:",
      error.message,
    );
    works = getHardcodedProjects();
  }

  return (
    <section className="featured-work-section">
      <div className="featured-work-header">
        <div className="featured-label">
          <span>[ WORK ]</span>
        </div>
        <div className="featured-center">
          {/* ✅ REMOVED AnimatedHeading - plain H1 like Vite */}
          <h1 className="featured-headline">
            Navigating through the noise to uncover and design the essential
            narrative.
          </h1>
        </div>
        <div className="featured-action">
          <Link href="/work" className="btn-primary" id="see-all-work">
            See All Work
          </Link>
        </div>
      </div>

      <div className="work-grid">
        {works.map((work, index) => {
          const attrs = work.attributes;
          const imageUrl =
            getStrapiMedia(attrs.thumbnail) ||
            getStrapiMedia(attrs.image) ||
            "https://images.unsplash.com/photo-1481487484168-9b930d5b7d25";

          return (
            <Link
              href={`/work/${attrs.slug}`}
              key={work.id}
              className="work-card"
              data-index={index}
            >
              <div className="work-card-image" style={{ position: "relative" }}>
                <Image
                  src={imageUrl}
                  alt={attrs.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="work-card-overlay"></div>
              </div>

              <div className="work-card-content">
                <span className="work-card-title">{attrs.title}</span>
                <h3 className="work-card-tagline">
                  {attrs.tagline || attrs.client || "Project Tagline"}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
