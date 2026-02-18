"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersListPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is ADMIN
    if (session?.user?.role !== "ADMIN") {
      window.location.href = "/admin";
      return;
    }
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      // API returns { users: [...] }
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Users</h2>
        <Link href="/admin/users/new" className="btn btn-primary">
          + New User
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || "-"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          user.role === "ADMIN"
                            ? "#dbeafe"
                            : user.role === "EDITOR"
                              ? "#fef3c7"
                              : "#f3f4f6",
                        color:
                          user.role === "ADMIN"
                            ? "#1e40af"
                            : user.role === "EDITOR"
                              ? "#92400e"
                              : "#374151",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      Edit
                    </Link>
                    {user.id !== session?.user?.id && (
                      <button
                        onClick={() => handleDelete(user.id)}
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

          {users.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              No users found
            </div>
          )}
        </>
      )}
    </div>
  );
}
