"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "@/app/components/admin/TiptapEditor";

import { use } from "react";

interface Section {
  id?: string;
  title: string;
  description: string;
  images: string[];
}

interface Credit {
  id?: string;
  name: string;
  role: string;
}

export default function EditProjectPage({ params }: { params: any }) {
  const unwrappedParams = use(params) as any;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    slug: "",
    year: "",
    services: [] as string[],
    thumbnail: "",
    logo: "",
    featured: false,
    published: false,
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${unwrappedParams.id}`);
      const project = await response.json();

      setFormData({
        client: project.client,
        slug: project.slug,
        year: project.year || "",
        services: project.services || [],
        thumbnail: project.thumbnail || "",
        logo: project.logo || "",
        featured: project.featured,
        published: project.published,
      });
      setSections(project.sections || []);
      setCredits(project.credits || []);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      alert("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "logo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const addSection = () => {
    setSections([...sections, { title: "", description: "", images: [] }]);
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addCredit = () => {
    setCredits([...credits, { name: "", role: "" }]);
  };

  const updateCredit = (index: number, field: keyof Credit, value: string) => {
    const updated = [...credits];
    updated[index] = { ...updated[index], [field]: value };
    setCredits(updated);
  };

  const removeCredit = (index: number) => {
    setCredits(credits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/projects/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          services: formData.services.map((s) => s.trim()).filter(Boolean),
          sections,
          credits,
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Edit Project
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) =>
              setFormData({ ...formData, client: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            style={{ fontFamily: "monospace" }}
          />
        </div>

        <div className="form-group">
          <label>Year *</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="e.g., 2024"
            required
          />
        </div>

        <div className="form-group">
          <label>Services *</label>
          <input
            type="text"
            value={formData.services.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                services: e.target.value.split(","),
              })
            }
            placeholder="e.g., Web Design, Branding, UI/UX"
            required
          />
          <small style={{ color: "#6b7280", fontSize: "13px" }}>
            Separate services with commas
          </small>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label>Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "thumbnail")}
              disabled={uploadingImage}
            />
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Thumbnail"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logo")}
              disabled={uploadingImage}
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
        </div>

        <div style={{ marginTop: "30px", marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="btn btn-secondary"
            >
              + Add Section
            </button>
          </div>

          {sections.map((section, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "500" }}>
                  Section {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="btn btn-danger"
                  style={{ fontSize: "12px", padding: "4px 8px" }}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(index, "title", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Section Description</label>
                <TiptapEditor
                  content={section.description}
                  onChange={(content) =>
                    updateSection(index, "description", content)
                  }
                />
              </div>

              <div className="form-group">
                <label>Section Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    setUploadingImage(true);
                    try {
                      const uploadedUrls: string[] = [];

                      for (const file of files) {
                        const formData = new FormData();
                        formData.append("file", file);

                        const response = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await response.json();
                        if (data.success) {
                          uploadedUrls.push(data.url);
                        }
                      }

                      if (uploadedUrls.length > 0) {
                        updateSection(index, "images", [
                          ...(section.images || []),
                          ...uploadedUrls,
                        ]);
                      }
                    } catch (error) {
                      console.error("Upload error:", error);
                      alert("Failed to upload images");
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>
                    Uploading images...
                  </p>
                )}

                {section.images && section.images.length > 0 && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {section.images.map((url, imgIdx) => (
                      <div
                        key={imgIdx}
                        style={{
                          position: "relative",
                          aspectRatio: "1",
                        }}
                      >
                        <img
                          src={url}
                          alt={`Section ${index + 1} Image ${imgIdx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...section.images];
                            newImages.splice(imgIdx, 1);
                            updateSection(index, "images", newImages);
                          }}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "30px", marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Credits</h3>
            <button
              type="button"
              onClick={addCredit}
              className="btn btn-secondary"
            >
              + Add Credit
            </button>
          </div>

          {credits.map((credit, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: "15px",
                marginBottom: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={credit.name}
                onChange={(e) => updateCredit(index, "name", e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                }}
              />
              <input
                type="text"
                placeholder="Role"
                value={credit.role}
                onChange={(e) => updateCredit(index, "role", e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                }}
              />
              <button
                type="button"
                onClick={() => removeCredit(index)}
                className="btn btn-danger"
                style={{ fontSize: "12px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
            />
            Featured Project (Show on Homepage)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
            />
            Published
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/admin/projects")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
