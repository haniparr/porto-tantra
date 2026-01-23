import { getProjects } from "@/app/lib/api";
import ProjectGrid from "@/app/components/sections/ProjectGrid";
import GradientWrapper from "@/app/components/ui/GradientWrapper";
import AnimatedHeading from "@/app/components/ui/AnimatedHeading";

export const metadata = {
  title: "Selected Work - Tantra Hariastama",
  description: "A curated selection of projects.",
};

// --- DATA FALLBACK ---
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
              url: "https://via.placeholder.com/60x60/1a1a1a/ffffff?text=F",
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
              url: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80",
            },
          },
        },
        logo: {
          data: {
            attributes: {
              url: "https://via.placeholder.com/60x60/1a1a1a/ffffff?text=E",
            },
          },
        },
      },
    },
  ];
}

export default async function WorkPage() {
  let projects = [];

  // 1. Fetch Data
  try {
    const response = await getProjects();
    if (response && response.data) {
      projects = response.data;
    }
  } catch (error) {
    console.warn("API Error (Work Page):", error.message);
  }

  // 2. Fallback
  if (projects.length === 0) {
    projects = getFallbackProjects();
  }

  return (
    // Gunakan inline style untuk layout agar tidak perlu file CSS baru
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        paddingTop: "160px" /* PENTING: Jarak agar tidak ketutup Navbar */,
        paddingBottom: "100px",
        backgroundColor: "var(--color-bg)" /* Mengambil dari main.css */,
      }}
    >
      <GradientWrapper>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem",
            marginBottom: "4rem",
          }}
        >
          {/* Header Section */}
          <div style={{ maxWidth: "800px" }}>
            <h1
              style={{
                fontFamily: "var(--font-headline)",
                fontSize:
                  "clamp(2.5rem, 5vw, 4.5rem)" /* Responsif tanpa media query CSS */,
                fontWeight: "700",
                marginBottom: "1rem",
                lineHeight: "1.1",
                color: "var(--color-text)",
              }}
            >
              Selected Work
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.25rem",
                opacity: 0.7,
                lineHeight: "1.6",
                maxWidth: "600px",
                color: "var(--color-text)",
              }}
            >
              A selection of projects that define my journey in visual design.
            </p>
          </div>
        </div>

        {/* Grid Project */}
        {/* Style grid ini sudah ada di grid.css yang diimport di ProjectGrid.jsx */}
        <ProjectGrid projects={projects} />
      </GradientWrapper>
    </div>
  );
}
