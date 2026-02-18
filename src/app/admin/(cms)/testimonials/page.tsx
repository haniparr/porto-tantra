"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";

interface Testimonial {
  id: string;
  clientName: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number | null;
  published: boolean;
  createdAt: string;
}

export default function TestimonialsListPage() {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  useEffect(() => {
    fetchTestimonials();
  }, [search, page]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(`/api/testimonials?${params}`);
      const data = await response.json();
      setTestimonials(data.testimonials);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Testimonial",
      message:
        "Are you sure you want to delete this testimonial? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/testimonials/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            fetchTestimonials();
          }
        } catch (error) {
          console.error("Delete error:", error);
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
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Testimonials</h2>
        <Link href="/admin/testimonials/new" className="btn btn-primary">
          + New Testimonial
        </Link>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search testimonials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            width: "100%",
            maxWidth: "400px",
          }}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Company</th>
                <th>Position</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td>{testimonial.clientName}</td>
                  <td>{testimonial.company || "-"}</td>
                  <td>{testimonial.position || "-"}</td>
                  <td>
                    {testimonial.rating ? "⭐".repeat(testimonial.rating) : "-"}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        background: testimonial.published
                          ? "#d1fae5"
                          : "#fee2e2",
                        color: testimonial.published ? "#065f46" : "#991b1b",
                      }}
                    >
                      {testimonial.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="actions">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      Edit
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="btn btn-danger"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {testimonials.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              No testimonials found
            </div>
          )}

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
