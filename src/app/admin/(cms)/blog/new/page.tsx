"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/app/components/admin/ImageUploader";
import TiptapEditor from "@/app/components/admin/TiptapEditor";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "", // Tiptap HTML
    featuredImage: "",
    category: "NEWS",
    tags: "",
    publishedDate: new Date().toISOString().split("T")[0],
    readTime: "",
    featured: false,
    published: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        New Blog Post
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => {
              setFormData({ ...formData, slug: e.target.value });
              setSlugManuallyEdited(true);
            }}
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
          <ImageUploader
            currentImage={formData.featuredImage}
            onUpload={(url) => setFormData({ ...formData, featuredImage: url })}
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
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="NEWS">News</option>
              <option value="INDUSTRY_INSIGHTS">Industry Insights</option>
              <option value="CASE_STUDY">Case Study</option>
              <option value="TUTORIAL">Tutorial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Separate with commas"
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div className="form-group">
            <label>Published Date</label>
            <input
              type="date"
              value={formData.publishedDate}
              onChange={(e) =>
                setFormData({ ...formData, publishedDate: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Read Time</label>
            <input
              type="text"
              placeholder="e.g. 5 min read"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
            />
          </div>
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
            Featured Post
          </label>
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
            Publish Immediately
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
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
