"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/export");
      const data = await response.json();

      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cms-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importData),
      });

      if (response.ok) {
        alert("Data imported successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to import data");
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import data. Please check the file format.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "30px" }}>
        Settings
      </h2>

      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}
        >
          Data Management
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Export and import all CMS data in JSON format
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={handleExport}
            disabled={exporting || session?.user?.role !== "ADMIN"}
            className="btn btn-primary"
          >
            {exporting ? "Exporting..." : "📥 Export Data"}
          </button>

          <label
            className="btn btn-secondary"
            style={{
              cursor:
                importing || session?.user?.role !== "ADMIN"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {importing ? "Importing..." : "📤 Import Data"}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing || session?.user?.role !== "ADMIN"}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {session?.user?.role !== "ADMIN" && (
          <p style={{ color: "#ef4444", marginTop: "10px", fontSize: "14px" }}>
            ⚠️ Only administrators can export/import data
          </p>
        )}
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}
        >
          User Information
        </h3>
        <div
          style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Email:</strong> {session?.user?.email}
          </p>
          <p>
            <strong>Name:</strong> {session?.user?.name || "Not set"}
          </p>
          <p>
            <strong>Role:</strong> {session?.user?.role}
          </p>
        </div>
      </div>

      <div>
        <h3
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}
        >
          Environment Variables
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "15px" }}>
          Make sure these environment variables are configured:
        </p>
        <ul
          style={{ listStyle: "disc", paddingLeft: "20px", color: "#6b7280" }}
        >
          <li>DATABASE_URL - Database connection string</li>
          <li>NEXTAUTH_SECRET - NextAuth secret key</li>
          <li>NEXTAUTH_URL - Application URL</li>
          <li>CLOUDINARY_CLOUD_NAME - Cloudinary cloud name</li>
          <li>CLOUDINARY_API_KEY - Cloudinary API key</li>
          <li>CLOUDINARY_API_SECRET - Cloudinary API secret</li>
        </ul>
      </div>
    </div>
  );
}
