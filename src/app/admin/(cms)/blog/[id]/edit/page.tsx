"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "@/app/components/admin/TiptapEditor";
import { use } from "react";

export default function EditBlogPostPage({ params }: { params: any }) {
  const unwrappedParams = use(params) as any;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "NEWS",
    tags: "",
    readTime: "",
    featured: false,
    published: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${unwrappedParams.id}`);
      const post = await response.json();

      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage || "",
        category: post.category,
        tags: (post.tags || []).join(", "),
        readTime: post.readTime || "",
        featured: post.featured,
        published: post.published,
      });
    } catch (error) {
      console.error("Failed to fetch post:", error);
      alert("Failed to load blog post");
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
        setFormData((prev) => ({ ...prev, featuredImage: data.url }));
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
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await fetch(`/api/blog/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          publishedDate: formData.published ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update blog post");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update blog post");
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
        Edit Blog Post
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
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
          />
        </div>

        <div className="form-group">
          <label>Excerpt *</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            required
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Content *</label>
          <TiptapEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage && <p>Uploading...</p>}
          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt="Featured"
              style={{
                maxWidth: "300px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="NEWS">News</option>
              <option value="INDUSTRY_INSIGHTS">Industry Insights</option>
              <option value="CASE_STUDY">Case Study</option>
              <option value="TUTORIAL">Tutorial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
              placeholder="e.g., 5 min read"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="design, development, tutorial"
          />
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
            />
            Featured Post
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
            onClick={() => router.push("/admin/blog")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
