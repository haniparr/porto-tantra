"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import Image from "next/image";

export default function ClientsListPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Add a timestamp parameter as cache buster to ensure next.js doesn't cache the API response aggressively
      const res = await fetch(`/api/clients?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/clients/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete client");

      // Refresh list
      fetchClients();
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
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Clients</h2>
        <Link href="/admin/clients/new/edit" className="btn btn-primary">
          + Add New Client
        </Link>
      </div>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</div>
      )}

      {loading ? (
        <div>Loading clients...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>Order</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Logo</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Name</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Status</th>
                <th style={{ textAlign: "right", padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No clients found. Add one to get started.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "12px" }}>{`${client.order}`}</td>
                    <td style={{ padding: "12px" }}>
                      {client.logo ? (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            position: "relative",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            src={client.logo}
                            alt={client.name}
                            width={40}
                            height={40}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            position: "relative",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            color: "#6b7280",
                          }}
                        >
                          No Logo
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {client.name}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          background: client.published ? "#d1fae5" : "#fee2e2",
                          color: client.published ? "#065f46" : "#991b1b",
                        }}
                      >
                        {client.published ? "Published" : "Draft"}
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
                          href={`/admin/clients/${client.id}/edit`}
                          className="btn btn-secondary"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(client.id)}
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
          title="Delete Client"
          message="Are you sure you want to delete this client? This action cannot be undone."
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
