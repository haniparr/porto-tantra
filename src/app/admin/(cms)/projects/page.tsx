"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";

interface Project {
  id: string;
  client: string;
  slug: string;
  year: string;
  services: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function ProjectsListPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  useEffect(() => {
    fetchProjects();
  }, [search, page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();
      setProjects(data.projects);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Project",
      message:
        "Are you sure you want to delete this project? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            fetchProjects();
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(projects.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Selected Projects",
      message: `Are you sure you want to delete ${selectedIds.length} projects? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch("/api/projects/bulk-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedIds }),
          });

          if (response.ok) {
            setSelectedIds([]);
            fetchProjects();
          }
        } catch (error) {
          console.error("Bulk delete error:", error);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Projects</h2>
        <Link href="/admin/projects/new" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            flex: "1",
            minWidth: "200px",
          }}
        />
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="btn btn-danger"
            style={{ fontSize: "14px", padding: "8px 16px" }}
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th
                  style={{ textAlign: "left", padding: "12px", width: "40px" }}
                >
                  <input
                    type="checkbox"
                    checked={
                      projects.length > 0 &&
                      selectedIds.length === projects.length
                    }
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Client</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Year</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Slug</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Status</th>
                <th style={{ textAlign: "right", padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: "20px", textAlign: "center" }}
                  >
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr
                    key={project.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "12px" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => handleSelectOne(project.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {project.client}
                      {project.featured && (
                        <span
                          style={{
                            marginLeft: "8px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            background: "#fef3c7",
                            color: "#92400e",
                          }}
                        >
                          ★ Featured
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>{project.year}</td>
                    <td
                      style={{
                        padding: "12px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                    >
                      {project.slug}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          background: project.published ? "#d1fae5" : "#fee2e2",
                          color: project.published ? "#065f46" : "#991b1b",
                        }}
                      >
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "8px",
                        }}
                      >
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="btn btn-secondary"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(project.id);
                          }}
                          className="btn btn-danger"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span style={{ padding: "10px 16px" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type="danger"
      />
    </div>
  );
}
