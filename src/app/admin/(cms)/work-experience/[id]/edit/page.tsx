"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUploader from "@/app/components/admin/ImageUploader";

import { use } from "react";

export default function WorkExperienceEditForm({ params }: { params: any }) {
  const unwrappedParams = use(params) as any;
  const router = useRouter();
  const { data: session } = useSession();

  // 'new' literally means new, otherwise it's an ID
  const isNew = unwrappedParams.id === "new";
  const id = isNew ? null : unwrappedParams.id;

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    year: "",
    achievements: "",
    logo: "",
    order: 0,
    published: true,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      fetchExperience();
    }
  }, [id, isNew]);

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/work-experience");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      const exp = data.find((e) => e.id === id);
      if (exp) {
        setFormData({
          company: exp.company || "",
          role: exp.role || "",
          year: exp.year || "",
          achievements: exp.achievements || "",
          logo: exp.logo || "",
          order: exp.order || 0,
          published: exp.published ?? true,
        });
      } else {
        throw new Error("Work experience not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/work-experience" : `/api/work-experience/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save work experience");
      }

      router.push("/admin/work-experience");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EDITOR") {
    return (
      <div className="p-8">
        Access Denied. You do not have permission to view this page.
      </div>
    );
  }

  if (loading)
    return <div className="loading">Loading work experience details...</div>;

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        {isNew ? "Add Work Experience" : "Edit Work Experience"}
      </h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company Name *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Google, Freelance, Studio Y"
          />
        </div>

        <div className="form-group">
          <label>Company Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const formDataUpload = new FormData();
                formDataUpload.append("file", file);

                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formDataUpload,
                });

                const data = await response.json();
                if (data.success) {
                  setFormData((prev) => ({ ...prev, logo: data.url }));
                } else {
                  alert("Failed to upload image");
                }
              } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload image");
              }
            }}
          />
          {formData.logo && (
            <div
              style={{
                marginTop: "10px",
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={formData.logo}
                alt="Logo"
                style={{
                  maxWidth: "200px",
                  background: "#f0f0f0",
                  padding: "10px",
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={handleImageRemove}
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
          )}
          <small
            style={{
              color: "#6b7280",
              fontSize: "13px",
              display: "block",
              marginTop: "4px",
            }}
          >
            Recommended: Square image / SVG with transparent background
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role / Position *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="e.g. Senior Designer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year *</label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            placeholder="e.g. 2022 - Present, or 2020"
          />
        </div>

        <div className="form-group">
          <label htmlFor="achievements">Achievements / Description *</label>
          <textarea
            id="achievements"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            required
            style={{ minHeight: "150px" }}
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>

        <div className="form-group">
          <label>Display Order</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
          />
          <small style={{ color: "#6b7280", fontSize: "13px" }}>
            Lower numbers appear first
          </small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Published
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isNew ? "Create Entry" : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/admin/work-experience")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
