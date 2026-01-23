import { notFound } from "next/navigation";
import { getProjects } from "@/app/lib/api"; // Gunakan fungsi yang ada
import CaseStudyUI from "@/app/components/work/CaseStudyUI";
import { getHardcodedProjects } from "@/app/lib/dummy-data";

// 1. Generate Metadata untuk SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch project data
  const response = await getProjects();
  let project = response.data?.find((p) => p.attributes.slug === slug);

  // Fallback ke dummy data jika tidak ditemukan di API
  if (!project) {
    const dummyProjects = getHardcodedProjects();
    project = dummyProjects.find((p) => p.attributes.slug === slug);
  }

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
  let projectItem = response.data?.find((p) => p.attributes.slug === slug);

  // Fallback ke dummy data jika tidak ditemukan di API
  if (!projectItem) {
    const dummyProjects = getHardcodedProjects();
    projectItem = dummyProjects.find((p) => p.attributes.slug === slug);
  }

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
    sections:
      attrs.sections?.map((section, idx) => ({
        id: section.id || `section-${idx}`,
        title: section.title,
        description: section.description,
        // Map images from the section component
        images: section.images?.data?.map((img) => img.attributes.url) || [],
      })) || [],
  };

  return (
    <div className="project-detail-page" style={{ paddingTop: "100px" }}>
      <CaseStudyUI project={projectData} />
    </div>
  );
}
