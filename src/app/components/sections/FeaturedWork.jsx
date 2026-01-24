import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";

// ✅ HARDCODED FALLBACK DATA (sama seperti Vite)
function getHardcodedWorks() {
  return [
    {
      id: "hardcoded-2",
      attributes: {
        slug: "body-om",
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
      id: "hardcoded-1",
      attributes: {
        slug: "beermut",
        title: "Beermut",
        tagline: "Bringing fun to gatherings.",
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
  // ✅ LOGIC SAMA DENGAN VITE: Try API first, fallback to hardcoded
  let works = [];

  try {
    const response = await getProjects(true); // featured = true
    if (response && response.data && response.data.length > 0) {
      works = response.data;
      console.log("✅ Using Strapi data for FeaturedWork");
    } else {
      works = getHardcodedWorks();
      console.log("⚠️ Using hardcoded data for FeaturedWork (no Strapi data)");
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
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80";

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
