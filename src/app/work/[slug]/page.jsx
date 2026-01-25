import { getProjects, getProject } from "@/app/lib/api";
import { getStrapiMedia } from "@/app/lib/utils";
import CaseStudyUI from "@/app/components/work/CaseStudyUI";

// Helper to fix Strapi Markdown (handle line breaks)
function fixMarkdown(content) {
  if (typeof content !== "string") return "";
  // Ensure newlines are treated as breaks if they aren't double newlines (optional, but helps with "glued" markdown)
  // Strapi standard usage often results in single newlines which Markdown acts as soft-spaces.
  // Converting single \n to \n\n ensures lists and paragraphs break correctly.
  return content.replace(/\n/g, "\n\n");
}

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
  const decodedSlug = decodeURIComponent(slug); // Ensure slug is decoded

  try {
    console.log("🔍 [generateMetadata] START for slug:", decodedSlug);
    // Use getProjects() (fetch all) instead of getProject(slug) to match the working page logic
    // This bypasses potential issues with the single-item API filter
    const response = await getProjects();

    const project = response.data?.find((p) => {
      const pSlug = p.attributes?.slug || p.slug;
      return pSlug === decodedSlug;
    });

    if (!project) {
      console.warn(
        "⚠️ [generateMetadata] Project not found in list, using fallback",
      );
      const defaultProject = getDefaultProjectData(decodedSlug);
      return {
        title: `${defaultProject.title} - Case Study`,
        description: defaultProject.subtitle,
      };
    }

    const attrs = project.attributes || project;
    console.log("✅ [generateMetadata] SUCCESS from Strapi:", attrs.client);

    return {
      title: `${attrs.client || attrs.title} | Tantra Hariastama`,
      description:
        attrs.services || attrs.subtitle || "Project portfolio case study.",
      openGraph: {
        title: `${attrs.client || attrs.title} - Case Study`,
        description: attrs.services || attrs.subtitle,
        images: attrs.thumbnail ? [getStrapiMedia(attrs.thumbnail)] : [],
      },
    };
  } catch (error) {
    console.error("❌ [generateMetadata] CRITICAL ERROR:", error);
    const defaultProject = getDefaultProjectData(decodedSlug);
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

  try {
    console.log("Fetching project with slug:", slug);
    const response = await getProjects();

    const projectItem = response.data?.find((p) => {
      const pSlug = p.attributes?.slug || p.slug;
      return pSlug === slug;
    });

    if (projectItem) {
      const attrs = projectItem.attributes || projectItem;
      console.log("✅ Project found in Strapi:", attrs.client);

      // ✅ ADD: Debug raw credits
      console.log("Raw credits from Strapi:", attrs.credits);

      const getImageUrl = (media) => {
        const url = getStrapiMedia(media);
        if (url) return url;
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
      };

      // ✅ FIXED: Transform credits with better handling
      let credits = [];
      if (attrs.credits) {
        console.log("Credits data type:", typeof attrs.credits);
        console.log("Credits is array?", Array.isArray(attrs.credits));

        // Case 1: Credits is array of objects with name & role
        if (Array.isArray(attrs.credits)) {
          credits = attrs.credits
            .filter((credit) => credit && (credit.name || credit.role)) // Filter out empty items
            .map((credit) => ({
              name: credit.name || credit.Name || "Unknown",
              role: credit.role || credit.Role || "Contributor",
            }));
        }
        // Case 2: Credits might be nested in data property
        else if (attrs.credits.data && Array.isArray(attrs.credits.data)) {
          credits = attrs.credits.data
            .filter((item) => item.attributes)
            .map((item) => ({
              name: item.attributes.name || item.attributes.Name || "Unknown",
              role:
                item.attributes.role || item.attributes.Role || "Contributor",
            }));
        }
        // Case 3: Credits is a single object
        else if (typeof attrs.credits === "object" && attrs.credits.name) {
          credits = [
            {
              name: attrs.credits.name || "Unknown",
              role: attrs.credits.role || "Contributor",
            },
          ];
        }
      }

      console.log("Transformed credits:", credits);
      console.log("Credits count:", credits.length);

      // ✅ Transform sections (existing code)
      let sections = [];
      if (
        attrs.sections &&
        Array.isArray(attrs.sections) &&
        attrs.sections.length > 0
      ) {
        sections = attrs.sections.map((section, index) => {
          const sectionImages =
            section.images?.data
              ?.map((img) => getStrapiMedia(img))
              .filter((url) => url !== null) || [];

          if (!section.images?.data && Array.isArray(section.images)) {
            const flattenedImages = section.images
              .map((img) => getStrapiMedia(img))
              .filter((url) => url !== null);
            if (flattenedImages.length > 0) {
              sectionImages.push(...flattenedImages);
            }
          }

          return {
            id: section.title.toLowerCase().replace(/\s+/g, "-"),
            title: `${String(index + 1).padStart(2, "0")} ${section.title}`,
            description:
              fixMarkdown(section.description) || "No content available.",
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
        credits: credits, // ✅ Use transformed credits
        sections:
          sections.length > 0 ? sections : getDefaultProjectData(slug).sections,
      };

      console.log("✅ Final projectData.credits:", projectData.credits);
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

  if (!projectData) {
    console.warn("⚠️ No project data available, using generic fallback");
    projectData = getDefaultProjectData(slug);
    isUsingFallback = true;
  }

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
