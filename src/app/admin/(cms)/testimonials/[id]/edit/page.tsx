"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "@/app/components/admin/TiptapEditor";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    position: "",
    content: "",
    avatar: "",
    rating: 5,
    published: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/testimonials/${params.id}`);
      const testimonial = await response.json();

      setFormData({
        clientName: testimonial.clientName,
        company: testimonial.company || "",
        position: testimonial.position || "",
        content: testimonial.content,
        avatar: testimonial.avatar || "",
        rating: testimonial.rating || 5,
        published: testimonial.published,
      });
    } catch (error) {
      console.error("Failed to fetch testimonial:", error);
      alert("Failed to load testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, avatar: data.url }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/testimonials/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/testimonials");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update testimonial");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update testimonial");
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
        Edit Testimonial
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <TiptapEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage && <p>Uploading...</p>}
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Avatar"
              style={{
                maxWidth: "150px",
                marginTop: "10px",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Rating (1-5 stars)</label>
          <select
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: parseInt(e.target.value) })
            }
          >
            <option value={1}>⭐ 1 Star</option>
            <option value={2}>⭐⭐ 2 Stars</option>
            <option value={3}>⭐⭐⭐ 3 Stars</option>
            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
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
            onClick={() => router.push("/admin/testimonials")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
