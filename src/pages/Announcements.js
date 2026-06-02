import React, { useState, useEffect } from "react";
import { announcementAPI } from "../services/api";
import { MdCampaign, MdAdd, MdClose, MdDelete, MdEdit } from "react-icons/md";

const priorityConfig = {
  LOW: { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", label: "Low" },
  NORMAL: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Normal",
  },
  HIGH: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "High" },
  URGENT: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecdd3",
    label: "Urgent",
  },
};

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "NORMAL",
    isActive: true,
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = isAdmin
        ? await announcementAPI.getAll()
        : await announcementAPI.getActive();
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      alert("Please fill title and content");
      return;
    }
    try {
      if (editing) {
        await announcementAPI.update(editing.id, form);
      } else {
        await announcementAPI.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", content: "", priority: "NORMAL", isActive: true });
      loadData();
    } catch (err) {
      alert("Error saving announcement");
    }
  };

  const handleEdit = (ann) => {
    setEditing(ann);
    setForm({
      title: ann.title,
      content: ann.content,
      priority: ann.priority,
      isActive: ann.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementAPI.delete(id);
      loadData();
    } catch (err) {
      alert("Error deleting");
    }
  };

  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  if (loading)
    return (
      <div className="loading">
        <MdCampaign size={28} />
        Loading...
      </div>
    );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Announcements</div>
          <div className="page-subtitle">
            {isAdmin
              ? `${announcements.length} total announcements`
              : "Company notices and updates"}
          </div>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditing(null);
              setForm({
                title: "",
                content: "",
                priority: "NORMAL",
                isActive: true,
              });
            }}
          >
            {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
            {showForm ? "Cancel" : "New Announcement"}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && isAdmin && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">
              {editing ? "Edit Announcement" : "New Announcement"}
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Announcement title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Write your announcement here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  style={{ resize: "vertical", minHeight: 100 }}
                />
              </div>
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.value === "true" })
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editing ? "Update" : "Publish"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements list */}
      {announcements.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">
                <MdCampaign />
              </div>
              <div className="empty-title">No announcements</div>
              <div className="empty-sub">
                {isAdmin
                  ? 'Click "New Announcement" to post one'
                  : "No announcements from HR yet"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {announcements.map((ann) => {
            const p = priorityConfig[ann.priority] || priorityConfig.NORMAL;
            return (
              <div
                key={ann.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: `1px solid ${p.border}`,
                  padding: "20px 24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "all 150ms",
                  opacity: ann.isActive ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    {/* Priority indicator */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: p.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MdCampaign size={20} color={p.color} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 3,
                        }}
                      >
                        {ann.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            background: p.bg,
                            color: p.color,
                            padding: "2px 9px",
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 700,
                            border: `1px solid ${p.border}`,
                          }}
                        >
                          {p.label}
                        </span>
                        {!ann.isActive && (
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#94a3b8",
                              padding: "2px 9px",
                              borderRadius: 20,
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            Inactive
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(ann.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin actions */}
                  {isAdmin && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => handleEdit(ann)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          color: "#334155",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MdEdit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid #fecdd3",
                          background: "#fef2f2",
                          color: "#dc2626",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MdDelete size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <p
                  style={{
                    fontSize: 13.5,
                    color: "#475569",
                    lineHeight: 1.7,
                    margin: 0,
                    paddingLeft: 50,
                  }}
                >
                  {ann.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Announcements;
