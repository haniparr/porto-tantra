"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogListPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  useEffect(() => {
    fetchPosts();
  }, [search, category, publishedFilter, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(category && { category }),
        ...(publishedFilter && { published: publishedFilter }),
      });

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Blog Post",
      message:
        "Are you sure you want to delete this post? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/blog/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            fetchPosts();
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Multiple Posts",
      message: `Are you sure you want to delete ${selectedPosts.length} selected post(s)? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch("/api/blog/bulk-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedPosts }),
          });

          if (response.ok) {
            setSelectedPosts([]);
            fetchPosts();
          }
        } catch (error) {
          console.error("Bulk delete error:", error);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const togglePostSelection = (id: string) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleAllPosts = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((p) => p.id));
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
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Blog Posts</h2>
        <Link href="/admin/blog/new" className="btn btn-primary">
          + New Post
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
          placeholder="Search posts..."
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        >
          <option value="">All Categories</option>
          <option value="NEWS">News</option>
          <option value="INDUSTRY_INSIGHTS">Industry Insights</option>
          <option value="CASE_STUDY">Case Study</option>
          <option value="TUTORIAL">Tutorial</option>
        </select>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        {session?.user?.role === "ADMIN" && selectedPosts.length > 0 && (
          <button onClick={handleBulkDelete} className="btn btn-danger">
            Delete Selected ({selectedPosts.length})
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
                {session?.user?.role === "ADMIN" && (
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedPosts.length === posts.length &&
                        posts.length > 0
                      }
                      onChange={toggleAllPosts}
                    />
                  </th>
                )}
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  {session?.user?.role === "ADMIN" && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                      />
                    </td>
                  )}
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        background: post.published ? "#d1fae5" : "#fee2e2",
                        color: post.published ? "#065f46" : "#991b1b",
                      }}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.featured ? "⭐" : "-"}</td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      Edit
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(post.id)}
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

          {posts.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              No blog posts found
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
