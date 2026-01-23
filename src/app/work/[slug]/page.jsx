import { notFound } from "next/navigation";
import { getProjects } from "@/app/lib/api"; // Gunakan fungsi yang ada
import CaseStudyUI from "@/app/components/work/CaseStudyUI";

// 1. Generate Metadata untuk SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch project data
  const response = await getProjects();
  const project = response.data?.find((p) => p.attributes.slug === slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.attributes.title} - Case Study`,
    description: project.attributes.subtitle || "Project portfolio case study.",
  };
}

// 2. Main Page Component
export default async function ProjectDetailPage({ params }) {
  const { slug } = params;

  // Fetch all projects (atau fetch by slug jika API support)
  const response = await getProjects();

  // Cari project yang cocok dengan slug
  const projectItem = response.data?.find((p) => p.attributes.slug === slug);

  if (!projectItem) {
    return notFound(); // Tampilkan halaman 404
  }

  // Normalisasi data untuk dikirim ke UI
  // Kita perlu memetakan struktur Strapi (attributes) ke struktur yang diharapkan CaseStudyUI
  const attrs = projectItem.attributes;

  const projectData = {
    title: attrs.title,
    subtitle: attrs.subtitle || attrs.tagline, // Fallback
    credits: attrs.credits || [],
    // Pastikan struktur sections sesuai dengan yang diharapkan CaseStudyUI
    // Di Strapi biasanya Dynamic Zone atau Repeater
    sections: attrs.sections || [
      // Dummy fallback jika sections belum ada di Strapi, agar tidak error
      {
        id: "intro",
        title: "Overview",
        description: attrs.description || "Project overview.",
        images: [attrs.image, attrs.thumbnail].filter(Boolean),
      },
    ],
  };

  return (
    <div className="project-detail-page" style={{ paddingTop: "100px" }}>
      <CaseStudyUI project={projectData} />
    </div>
  );
}
