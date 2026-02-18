import { getProjects } from "@/app/lib/api";
import ProjectGrid from "@/app/components/sections/ProjectGrid";
import GradientWrapper from "@/app/components/ui/GradientWrapper";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading";

export const metadata = {
  title: "Selected Work - Tantra Hariastama",
  description: "A curated selection of projects.",
};

// --- FALLBACK DATA (sama seperti di main.js Vite) ---
function getFallbackProjects() {
  return [
    {
      id: "fb-1",
      attributes: {
        slug: "fintech-corp",
        client: "FinTech Corp",
        year: "2024",
        services: "Rebrand, UI/UX",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
        logo: {
          data: {
            attributes: {
              url: "https://placehold.co/40x40/333/fff?text=B",
            },
          },
        },
      },
    },
    {
      id: "fb-2",
      attributes: {
        slug: "eshop-global",
        client: "E-Shop Global",
        year: "2023",
        services: "E-commerce App",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
        logo: {
          data: {
            attributes: {
              url: "https://placehold.co/40x40/333/fff?text=E",
            },
          },
        },
      },
    },
    {
      id: "fb-3",
      attributes: {
        slug: "datasystems",
        client: "DataSystems",
        year: "2023",
        services: "SaaS Dashboard",
        thumbnail: {
          data: {
            attributes: {
              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
        logo: {
          data: {
            attributes: {
              url: "https://placehold.co/40x40/333/fff?text=Z",
            },
          },
        },
      },
    },
  ];
}

export default async function WorkPage() {
  let projects = [];

  // ✅ LOGIC SAMA DENGAN VITE: Try API first, fallback to hardcoded
  try {
    const response = await getProjects();
    if (response && response.data && response.data.length > 0) {
      projects = response.data;
    } else {
      projects = getFallbackProjects();
    }
  } catch (error) {
    projects = getFallbackProjects();
  }

  // ✅ Ensure we always have projects (safety check)
  if (!projects || projects.length === 0) {
    projects = getFallbackProjects();
  }

  return (
    <div className="gradient-container">
      <div
        className="work-page"
        style={{
          paddingTop: "clamp(100px, 15vh, 120px)",
          paddingBottom: "var(--spacing-md)",
          minHeight: "auto",
        }}
      >
        <div
          style={{
            padding: "0 var(--spacing-md)",
          }}
        >
          <AnimatedHeading
            text="Selected Work"
            as="h1"
            direction="right"
            className=""
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
            }}
          />
        </div>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
