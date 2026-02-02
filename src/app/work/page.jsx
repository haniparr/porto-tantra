import { getProjects } from "@/app/lib/api";
import ProjectGrid from "@/app/components/sections/ProjectGrid";
import GradientWrapper from "@/app/components/ui/GradientWrapper";
import AnimatedHeading from "../components/ui/AnimatedHeading";

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
      console.log("✅ Using Strapi data for Work Page");
      console.log(`📊 Loaded ${projects.length} projects from Strapi`);
    } else {
      projects = getFallbackProjects();
      console.log("⚠️ Using fallback data for Work Page (no Strapi data)");
      console.log(`📊 Loaded ${projects.length} fallback projects`);
    }
  } catch (error) {
    console.warn("⚠️ API Error in Work Page, using fallback data");
    console.warn("Error details:", error.message);
    projects = getFallbackProjects();
    console.log(`📊 Loaded ${projects.length} fallback projects after error`);
  }

  // ✅ Ensure we always have projects (safety check)
  if (!projects || projects.length === 0) {
    console.error(
      "❌ CRITICAL: No projects available, using emergency fallback",
    );
    projects = getFallbackProjects();
  }

  return (
    <div
      id="main-wrapper"
      style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}
    >
      <div className="gradient-container">
        <div
          className="work-page"
          style={{ paddingTop: "120px", minHeight: "100vh" }}
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
    </div>
  );
}
