import { getProjects } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import CaseStudyUI from "@/app/components/work/CaseStudyUI";

// ✅ DEFAULT PROJECT DATA (sama seperti Vite main.js)
function getDefaultProjectData(slug) {
  const defaultProjects = {
    "fintech-corp": {
      title: "FinTech Corp",
      subtitle: "Rebrand, UI/UX",
      year: "2024",
      credits: [
        { name: "John Doe", role: "Creative Direction" },
        { name: "Jane Smith", role: "Brand Strategy" },
        { name: "Mike Johnson", role: "UI/UX Design" },
        { name: "Sarah Williams", role: "Development" },
      ],
      sections: [
        {
          id: "overview",
          title: "01 Overview",
          description:
            "FinTech Corp approached us to modernize their digital presence and create a cohesive brand identity that would resonate with their target audience.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "challenge",
          title: "02 Challenge",
          description:
            "The main challenge was to differentiate FinTech Corp in a crowded market while maintaining trust and credibility with their enterprise clients.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "solution",
          title: "03 Solution",
          description:
            "We developed a bold visual identity centered around transparency, security, and innovation - three pillars that define the FinTech Corp brand.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    },
    "eshop-global": {
      title: "E-Shop Global",
      subtitle: "E-commerce Platform Design",
      year: "2023",
      credits: [
        { name: "Alex Turner", role: "Lead Designer" },
        { name: "Emma Davis", role: "UX Research" },
        { name: "Chris Brown", role: "Frontend Development" },
      ],
      sections: [
        {
          id: "overview",
          title: "01 Overview",
          description:
            "E-Shop Global needed a complete redesign of their e-commerce platform to improve conversion rates and user experience.",
          images: [
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "challenge",
          title: "02 Challenge",
          description:
            "The existing platform had high cart abandonment rates and poor mobile experience.",
          images: [
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "solution",
          title: "03 Solution",
          description:
            "We created a streamlined checkout process and mobile-first design that increased conversions by 45%.",
          images: [
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    },
  };

  return (
    defaultProjects[slug] || {
      title: "Sample Project",
      subtitle: "Design & Development",
      year: "2024",
      credits: [
        { name: "Design Team", role: "Creative Direction" },
        { name: "Development Team", role: "Implementation" },
      ],
      sections: [
        {
          id: "overview",
          title: "01 Overview",
          description:
            "This is a sample project showcasing our design capabilities.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "challenge",
          title: "02 Challenge",
          description:
            "Every project comes with unique challenges that require creative solutions.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "solution",
          title: "03 Solution",
          description:
            "We delivered a comprehensive solution that exceeded expectations.",
          images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    }
  );
}

// Helper to strip HTML tags (sama seperti Vite)
function stripHtmlTags(html) {
  if (!html) return "";
  // Simple regex to remove HTML tags
  return html.replace(/<[^>]*>/g, "");
}

// 1. Generate Metadata untuk SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await getProjects();
    const project = response.data?.find((p) => p.attributes.slug === slug);

    if (!project) {
      const defaultProject = getDefaultProjectData(slug);
      return {
        title: `${defaultProject.title} - Case Study`,
        description: defaultProject.subtitle,
      };
    }

    const attrs = project.attributes;
    return {
      title: `${attrs.client || attrs.title} - Case Study`,
      description:
        attrs.services || attrs.subtitle || "Project portfolio case study.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    const defaultProject = getDefaultProjectData(slug);
    return {
      title: `${defaultProject.title} - Case Study`,
      description: defaultProject.subtitle,
    };
  }
}

// 2. Main Page Component
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  let projectData = null;
  let isUsingFallback = false;

  // ✅ TRY-CATCH ERROR HANDLING (sama seperti Vite)
  try {
    console.log("Fetching project with slug:", slug);
    const response = await getProjects();

    // Cari project yang cocok dengan slug
    const projectItem = response.data?.find((p) => p.attributes.slug === slug);

    if (projectItem) {
      console.log("✅ Project found in Strapi:", projectItem.attributes.client);
      const attrs = projectItem.attributes;

      // Get image URL helper
      const getImageUrl = (media) => {
        const url = getStrapiMedia(media);
        if (url) return url;
        // Fallback to default
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
      };

      // ✅ Transform credits (support both old and new structure)
      let credits = [];
      if (
        attrs.credits &&
        Array.isArray(attrs.credits) &&
        attrs.credits.length > 0
      ) {
        // New structure: component with name + role
        credits = attrs.credits.map((credit) => ({
          name: credit.name || "Unknown",
          role: credit.role || "Contributor",
        }));
      }

      // ✅ Transform sections
      let sections = [];
      if (
        attrs.sections &&
        Array.isArray(attrs.sections) &&
        attrs.sections.length > 0
      ) {
        // Use new dynamic sections from Strapi
        sections = attrs.sections.map((section, index) => {
          const sectionImages =
            section.images?.data
              ?.map((img) => getStrapiMedia(img))
              .filter((url) => url !== null) || [];

          return {
            id: section.title.toLowerCase().replace(/\s+/g, "-"),
            title: `${String(index + 1).padStart(2, "0")} ${section.title}`,
            description:
              stripHtmlTags(section.description) || "No content available.",
            images:
              sectionImages.length > 0
                ? sectionImages
                : [
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                  ],
          };
        });
      }

      // Build project data
      projectData = {
        title: attrs.client || attrs.title || "Untitled Project",
        subtitle: attrs.services || attrs.subtitle || "Design Project",
        year: attrs.year || "2024",
        credits: credits,
        sections:
          sections.length > 0 ? sections : getDefaultProjectData(slug).sections,
      };

      console.log("✅ Using Strapi project data");
    } else {
      console.warn("⚠️ Project not found in Strapi, using fallback");
      projectData = getDefaultProjectData(slug);
      isUsingFallback = true;
    }
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    projectData = getDefaultProjectData(slug);
    isUsingFallback = true;
    console.log("⚠️ Using fallback project data due to error");
  }

  // ✅ FINAL FALLBACK (jika masih null)
  if (!projectData) {
    console.warn("⚠️ No project data available, using generic fallback");
    projectData = getDefaultProjectData(slug);
    isUsingFallback = true;
  }

  // ✅ VALIDATION: Ensure required fields
  if (!projectData.sections || projectData.sections.length === 0) {
    console.warn("⚠️ Project has no sections, adding default sections");
    projectData.sections = getDefaultProjectData(slug).sections;
  }

  return (
    <div className="project-detail-page" style={{ paddingTop: "100px" }}>
      <CaseStudyUI project={projectData} />
    </div>
  );
}
