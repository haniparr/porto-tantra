"use client";

import { useEffect, useState, useCallback } from "react";

interface Project {
  id: string;
  client: string;
  slug: string;
  year: string;
  thumbnail: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function FeaturedOrderPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchFeaturedProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects?limit=100&published=true");
      const data = await response.json();
      const featured = (data.projects || []).filter((p: Project) => p.featured);
      // Sort by createdAt desc (same as frontend)
      featured.sort(
        (a: Project, b: Project) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setProjects(featured);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      showMessage("error", "Gagal memuat data project.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    setReordering(id);
    try {
      const response = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction }),
      });

      if (response.ok) {
        showMessage(
          "success",
          `Project berhasil dipindah ${direction === "up" ? "ke atas" : "ke bawah"}.`,
        );
        await fetchFeaturedProjects();
      } else {
        const data = await response.json();
        showMessage("error", data.error || "Gagal mengubah urutan.");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      showMessage("error", "Terjadi kesalahan saat mengubah urutan.");
    } finally {
      setReordering(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>
            Featured Work Order
          </h2>
          <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
            Atur urutan tampil project di section Featured Work pada homepage.
            Project paling atas akan tampil pertama.
          </p>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            background: message.type === "success" ? "#d1fae5" : "#fee2e2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Info Box */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
          fontSize: "13px",
          color: "#1e40af",
        }}
      >
        ℹ️ Hanya project yang ditandai <strong>Featured</strong> yang tampil di
        sini. Untuk menambah/menghapus project dari Featured Work, edit project
        dan ubah toggle <em>Featured</em>.
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Memuat data...
        </div>
      ) : projects.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#6b7280",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px dashed #d1d5db",
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>
            Belum ada project yang di-featured.
          </p>
          <p style={{ fontSize: "13px" }}>
            Buka halaman Projects, edit project, lalu aktifkan toggle Featured.
          </p>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "14px 16px",
                borderBottom:
                  index < projects.length - 1 ? "1px solid #e2e8f0" : "none",
                background: reordering === project.id ? "#f0f9ff" : "#fff",
                transition: "background 0.2s",
              }}
            >
              {/* Order Number */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "#475569",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>

              {/* Thumbnail */}
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.client}
                  style={{
                    width: "60px",
                    height: "45px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    flexShrink: 0,
                    border: "1px solid #e2e8f0",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "45px",
                    borderRadius: "6px",
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  🖼️
                </div>
              )}

              {/* Project Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {project.client}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginTop: "2px",
                  }}
                >
                  {project.year} •{" "}
                  <span
                    style={{
                      fontFamily: "monospace",
                    }}
                  >
                    /{project.slug}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "500",
                  background: project.published ? "#d1fae5" : "#fee2e2",
                  color: project.published ? "#065f46" : "#991b1b",
                  flexShrink: 0,
                }}
              >
                {project.published ? "Published" : "Draft"}
              </span>

              {/* Reorder Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => handleReorder(project.id, "up")}
                  disabled={index === 0 || reordering !== null}
                  title="Pindah ke atas"
                  style={{
                    width: "32px",
                    height: "28px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background:
                      index === 0 || reordering !== null ? "#f9fafb" : "#fff",
                    cursor:
                      index === 0 || reordering !== null
                        ? "not-allowed"
                        : "pointer",
                    color:
                      index === 0 || reordering !== null
                        ? "#d1d5db"
                        : "#374151",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => handleReorder(project.id, "down")}
                  disabled={
                    index === projects.length - 1 || reordering !== null
                  }
                  title="Pindah ke bawah"
                  style={{
                    width: "32px",
                    height: "28px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background:
                      index === projects.length - 1 || reordering !== null
                        ? "#f9fafb"
                        : "#fff",
                    cursor:
                      index === projects.length - 1 || reordering !== null
                        ? "not-allowed"
                        : "pointer",
                    color:
                      index === projects.length - 1 || reordering !== null
                        ? "#d1d5db"
                        : "#374151",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
