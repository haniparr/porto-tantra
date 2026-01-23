import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading"; // Import komponen animasi

export default async function FeaturedWork() {
  const response = await getProjects(true);
  const works = response.data || [];

  return (
    <section className="featured-work-section">
      <div className="featured-work-header">
        <div className="featured-label">
          <span>[ WORK ]</span>
        </div>
        <div className="featured-center">
          {/* GANTI H1 BIASA DENGAN ANIMATED HEADING */}
          <AnimatedHeading
            text="Navigating through the noise to uncover and design the essential narrative."
            as="h1"
            className="featured-headline"
          />
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
            getStrapiMedia(attrs.thumbnail) || getStrapiMedia(attrs.image);

          return (
            <Link
              href={`/work/${attrs.slug}`}
              key={work.id}
              className="work-card"
              data-index={index}
            >
              <div className="work-card-image" style={{ position: "relative" }}>
                <Image
                  src={
                    imageUrl ||
                    "https://images.unsplash.com/photo-1481487484168-9b930d5b7d25"
                  }
                  alt={attrs.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
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
