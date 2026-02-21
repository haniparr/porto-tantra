"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";

export default function WorkExperienceListPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`/api/work-experience?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch work experiences");
      const data = await res.json();
      setExperiences(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/work-experience/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete entry");

      // Refresh list
      fetchExperiences();
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message);
      setDeleteId(null);
    }
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
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Work Experience</h2>
        <Link
          href="/admin/work-experience/new/edit"
          className="btn btn-primary"
        >
          + Add New Experience
        </Link>
      </div>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>
      )}

      {loading ? (
        <div>Loading work experiences...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>Order</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Year</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Company</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Role</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Status</th>
                <th style={{ textAlign: "right", padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No work experiences found. Add one to get started.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr
                    key={exp.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "12px" }}>{`${exp.order}`}</td>
                    <td style={{ padding: "12px" }}>{exp.year}</td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {exp.company}
                    </td>
                    <td style={{ padding: "12px" }}>{exp.role}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          background: exp.published ? "#d1fae5" : "#fee2e2",
                          color: exp.published ? "#065f46" : "#991b1b",
                        }}
                      >
                        {exp.published ? "Published" : "Draft"}
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
                          href={`/admin/work-experience/${exp.id}/edit`}
                          className="btn btn-secondary"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(exp.id)}
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
        </>
      )}

      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Work Experience"
          message="Are you sure you want to delete this work experience entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          type="danger"
        />
      )}
    </div>
  );
}
