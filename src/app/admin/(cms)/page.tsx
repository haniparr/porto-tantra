"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  blogPosts: { total: number; published: number; draft: number };
  projects: { total: number; published: number; draft: number };
  testimonials: { total: number };
  clients: { total: number; published: number; draft: number };
  workExperiences: { total: number; published: number; draft: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = "/auth/signin";
          return;
        }
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "600" }}>
        Dashboard Overview
      </h2>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>Blog Posts</h3>
          <div className="stat-value">{stats?.blogPosts?.total || 0}</div>
          <div className="stat-label">
            {stats?.blogPosts?.published || 0} published,{" "}
            {stats?.blogPosts?.draft || 0} drafts
          </div>
        </div>

        <div className="stat-card green">
          <h3>Projects</h3>
          <div className="stat-value">{stats?.projects?.total || 0}</div>
          <div className="stat-label">
            {stats?.projects?.published || 0} published,{" "}
            {stats?.projects?.draft || 0} drafts
          </div>
        </div>

        <div className="stat-card yellow">
          <h3>Testimonials</h3>
          <div className="stat-value">{stats?.testimonials?.total || 0}</div>
          <div className="stat-label">Total testimonials</div>
        </div>

        <div className="stat-card purple">
          <h3>Clients</h3>
          <div className="stat-value">{stats?.clients?.total || 0}</div>
          <div className="stat-label">
            {stats?.clients?.published || 0} published,{" "}
            {stats?.clients?.draft || 0} drafts
          </div>
        </div>

        <div className="stat-card orange">
          <h3>Work Experience</h3>
          <div className="stat-value">{stats?.workExperiences?.total || 0}</div>
          <div className="stat-label">
            {stats?.workExperiences?.published || 0} published,{" "}
            {stats?.workExperiences?.draft || 0} drafts
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3
          style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}
        >
          Quick Actions
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/admin/blog/new" className="btn btn-primary">
            + New Blog Post
          </a>
          <a href="/admin/projects/new" className="btn btn-primary">
            + New Project
          </a>
          <a href="/admin/testimonials/new" className="btn btn-primary">
            + New Testimonial
          </a>
        </div>
      </div>
    </div>
  );
}
