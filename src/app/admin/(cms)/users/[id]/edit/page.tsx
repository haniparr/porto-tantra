"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      window.location.href = "/admin";
      return;
    }
    fetchUser();
  }, [session]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`);
      const user = await response.json();

      setFormData({
        name: user.name || "",
        email: user.email,
        password: "",
        role: user.role,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (session?.user?.role !== "ADMIN") {
    return <div>Access denied. Admin only.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Edit User
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="user@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Leave blank to keep current password"
            minLength={8}
          />
          <small style={{ color: "#6b7280", fontSize: "12px" }}>
            Leave blank to keep current password. Min. 8 characters if changing.
          </small>
        </div>

        <div className="form-group">
          <label>Role *</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="VIEWER">VIEWER - Can only view content</option>
            <option value="EDITOR">EDITOR - Can create and edit content</option>
            <option value="ADMIN">ADMIN - Full access</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/admin/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
