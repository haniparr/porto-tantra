import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";

// ✅ HARDCODED FALLBACK DATA
function getHardcodedWorks() {
  return [
    {
      id: "hardcoded-1",
      attributes: {
        slug: "beermut",
        client: "Beermut",
        title: "Beermut",
        tagline: "Bringing fun to gatherings.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d25?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "hardcoded-2",
      attributes: {
        slug: "body-om",
        client: "Body Ōm",
        title: "Body Ōm",
        tagline: "To elevate mood and awaken the senses.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "hardcoded-3",
      attributes: {
        slug: "fapro",
        client: "Fapro",
        title: "Fapro",
        tagline: "Every piece of data, a business opportunity.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "hardcoded-4",
      attributes: {
        slug: "el-guarango",
        client: "El Guarango",
        title: "El Guarango",
        tagline: "This vermouth will bring you knowledge.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "hardcoded-5",
      attributes: {
        slug: "salta",
        client: "Salta",
        title: "Salta",
        tagline: "A gourmet snack for breaking routine.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
    {
      id: "hardcoded-6",
      attributes: {
        slug: "pocho",
        client: "Pocho",
        title: "Pocho",
        tagline: "Clothing to play and explore.",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
      },
    },
  ];
}

export default async function FeaturedWork() {
  let works = [];

  try {
    const response = await getProjects(true); // featured = true

    if (response && response.data && response.data.length > 0) {
      // ✅ FILTER & VALIDATE: Hanya ambil project dengan thumbnail valid
      works = response.data
        .filter((work) => {
          const attrs = work?.attributes;
          if (!attrs) return false;

          // Cek apakah thumbnail ada dan valid
          const hasThumbnail =
            attrs.thumbnail?.data?.attributes?.url ||
            attrs.thumbnail?.url ||
            attrs.image?.data?.attributes?.url ||
            attrs.image?.url;

          return hasThumbnail && attrs.slug;
        })
        .slice(0, 6); // Ambil max 6 projects

      console.log(
        "✅ Using Strapi data for FeaturedWork:",
        works.length,
        "projects",
      );
    }

    // ✅ FALLBACK jika tidak ada data valid
    if (works.length === 0) {
      works = getHardcodedWorks();
      console.log(
        "⚠️ Using hardcoded data for FeaturedWork (no valid Strapi data)",
      );
    }
  } catch (error) {
    console.warn(
      "API Error in FeaturedWork, using hardcoded data:",
      error.message,
    );
    works = getHardcodedWorks();
  }

  return (
    <section className="featured-work-section">
      <div className="featured-work-header">
        <div className="featured-label">
          <span>[ WORK ]</span>
        </div>
        <div className="featured-center">
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

          // ✅ SAFE IMAGE EXTRACTION dengan multiple fallbacks
          const imageUrl =
            getStrapiMedia(attrs.thumbnail) ||
            getStrapiMedia(attrs.image) ||
            attrs.thumbnail?.data?.attributes?.url ||
            attrs.thumbnail?.url ||
            attrs.image?.data?.attributes?.url ||
            attrs.image?.url ||
            "https://images.unsplash.com/photo-1481487484168-9b930d5b7d25?auto=format&fit=crop&w=800&q=80";

          // ✅ SAFE TEXT EXTRACTION
          const title = attrs.client || attrs.title || "Untitled Project";
          const tagline =
            attrs.tagline ||
            attrs.services ||
            attrs.subtitle ||
            "Project Description";
          const slug = attrs.slug || `project-${index}`;

          return (
            <Link
              href={`/work/${slug}`}
              key={work.id || index}
              className="work-card"
              data-index={index}
            >
              <div className="work-card-image" style={{ position: "relative" }}>
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
                <div className="work-card-overlay"></div>
              </div>

              <div className="work-card-content">
                <span className="work-card-title">{title}</span>
                <h3 className="work-card-tagline">{tagline}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
