import React, { useState, useEffect } from "react";
import { timesheetAPI, employeeAPI } from "../services/api";
import {
  MdAssignment,
  MdAdd,
  MdClose,
  MdCheck,
  MdAccessTime,
  MdWork,
} from "react-icons/md";

const statusConfig = {
  DRAFT: { bg: "#f1f5f9", color: "#475569", label: "Draft" },
  SUBMITTED: { bg: "#eff6ff", color: "#1e40af", label: "Submitted" },
  APPROVED: { bg: "#f0fdf4", color: "#166534", label: "Approved" },
  REJECTED: { bg: "#fef2f2", color: "#991b1b", label: "Rejected" },
};

const projectColors = [
  { bg: "#eff6ff", color: "#1e40af" },
  { bg: "#f0fdf4", color: "#166534" },
  { bg: "#faf5ff", color: "#5b21b6" },
  { bg: "#fffbeb", color: "#92400e" },
  { bg: "#fef2f2", color: "#991b1b" },
  { bg: "#f0fdfa", color: "#134e4a" },
];

const avatarColors = [
  { bg: "#eff6ff", text: "#1e40af" },
  { bg: "#f0fdf4", text: "#166534" },
  { bg: "#fffbeb", text: "#92400e" },
  { bg: "#faf5ff", text: "#5b21b6" },
  { bg: "#fef2f2", text: "#991b1b" },
];

const Timesheets = ({ user }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    workDate: "",
    hoursLogged: "",
    project: "",
    task: "",
    description: "",
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [tsRes, empRes] = await Promise.all([
        timesheetAPI.getPending(),
        employeeAPI.getActive(),
      ]);
      setTimesheets(tsRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.employeeId || !form.workDate || !form.hoursLogged) {
      alert("Please fill required fields");
      return;
    }
    setSaving(true);
    try {
      await timesheetAPI.create({
        employee: { id: form.employeeId },
        workDate: form.workDate,
        hoursLogged: parseFloat(form.hoursLogged),
        project: form.project,
        task: form.task,
        description: form.description,
        status: "SUBMITTED",
      });
      setShowForm(false);
      setForm({
        employeeId: "",
        workDate: "",
        hoursLogged: "",
        project: "",
        task: "",
        description: "",
      });
      loadAll();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await timesheetAPI.approve(id, user?.employeeId || 4);
      loadAll();
    } catch (err) {
      alert("Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      await timesheetAPI.reject(id);
      loadAll();
    } catch (err) {
      alert("Error rejecting");
    }
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  const tabs = ["ALL", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];
  const tabColors = {
    ALL: { active: "#0f172a" },
    DRAFT: { active: "#64748b", dot: "#64748b" },
    SUBMITTED: { active: "#1e40af", dot: "#3b82f6" },
    APPROVED: { active: "#16a34a", dot: "#16a34a" },
    REJECTED: { active: "#dc2626", dot: "#dc2626" },
  };

  const filtered =
    activeTab === "ALL"
      ? timesheets
      : timesheets.filter((t) => t.status === activeTab);
  const submittedCount = timesheets.filter(
    (t) => t.status === "SUBMITTED",
  ).length;
  const totalHours = timesheets.reduce(
    (s, t) => s + parseFloat(t.hoursLogged || 0),
    0,
  );
  const approvedHours = timesheets
    .filter((t) => t.status === "APPROVED")
    .reduce((s, t) => s + parseFloat(t.hoursLogged || 0), 0);

  // Group by project for summary
  const projectSummary = timesheets.reduce((acc, t) => {
    const p = t.project || "General";
    if (!acc[p]) acc[p] = { hours: 0, count: 0 };
    acc[p].hours += parseFloat(t.hoursLogged || 0);
    acc[p].count += 1;
    return acc;
  }, {});

  if (loading)
    return (
      <div className="loading">
        <MdAssignment size={28} />
        Loading timesheets...
      </div>
    );

  return (
    <div className="content">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Timesheets</div>
          <div className="page-subtitle">
            {timesheets.length} entries · {submittedCount} pending approval
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Log Time"}
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: "Total Entries",
            value: timesheets.length,
            color: "#334155",
            bg: "#f1f5f9",
            border: "#e2e8f0",
          },
          {
            label: "Total Hours",
            value: `${totalHours.toFixed(1)}h`,
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Approved Hours",
            value: `${approvedHours.toFixed(1)}h`,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Pending Review",
            value: submittedCount,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              borderRadius: 14,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: card.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: 6,
                opacity: 0.8,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: card.color,
                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Project Summary */}
      {Object.keys(projectSummary).length > 0 && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">Hours by Project</div>
            <div className="card-subtitle">
              {Object.keys(projectSummary).length} projects
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {Object.entries(projectSummary).map(([project, data], i) => {
                const pc = projectColors[i % projectColors.length];
                return (
                  <div
                    key={project}
                    style={{
                      background: pc.bg,
                      border: `1px solid ${pc.color}22`,
                      borderRadius: 12,
                      padding: "14px 18px",
                      minWidth: 140,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <MdWork size={16} color={pc.color} />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: pc.color,
                        }}
                      >
                        {project}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: pc.color,
                        lineHeight: 1,
                      }}
                    >
                      {data.hours.toFixed(1)}h
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: pc.color,
                        opacity: 0.7,
                        marginTop: 4,
                      }}
                    >
                      {data.count} {data.count === 1 ? "entry" : "entries"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Log Time Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Log Timesheet Entry</div>
              <div className="card-subtitle">
                Record hours worked on a project
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label className="form-label">Employee *</label>
                <select
                  className="form-control"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm({ ...form, employeeId: e.target.value })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Work Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.workDate}
                  onChange={(e) =>
                    setForm({ ...form, workDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hours Logged *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  className="form-control"
                  placeholder="e.g. 8"
                  value={form.hoursLogged}
                  onChange={(e) =>
                    setForm({ ...form, hoursLogged: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Project name"
                  list="project-list"
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                />
                <datalist id="project-list">
                  <option value="CRM Portal" />
                  <option value="HR Portal" />
                  <option value="Mobile App" />
                  <option value="Internal Tools" />
                  <option value="Client Project" />
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Task</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task description"
                  value={form.task}
                  onChange={(e) => setForm({ ...form, task: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Additional notes"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Hours preview */}
            {form.hoursLogged && (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "#1e40af",
                  fontWeight: 600,
                }}
              >
                <MdAccessTime size={16} />
                Logging{" "}
                <strong style={{ margin: "0 4px" }}>
                  {form.hoursLogged} hours
                </strong>
                {form.project && (
                  <>
                    on{" "}
                    <strong style={{ margin: "0 4px" }}>{form.project}</strong>
                  </>
                )}
                {form.workDate && (
                  <>
                    for{" "}
                    <strong style={{ margin: "0 4px" }}>{form.workDate}</strong>
                  </>
                )}
              </div>
            )}

            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Submit Timesheet"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timesheets Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Timesheet Records</div>
            <div className="card-subtitle">{filtered.length} records</div>
          </div>
          {/* Styled Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {tabs.map((tab) => {
              const tc = tabColors[tab];
              const isActive = activeTab === tab;
              const count =
                tab === "ALL"
                  ? timesheets.length
                  : timesheets.filter((t) => t.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "7px 13px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    background: isActive ? tc.active : "#f1f5f9",
                    color: isActive ? "#fff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 150ms",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
                  }}
                >
                  {tc.dot && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: isActive ? "#fff" : tc.dot,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  <span
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "#e2e8f0",
                      color: isActive ? "#fff" : "#64748b",
                      borderRadius: 20,
                      padding: "1px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Project</th>
                <th>Task</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const sc = statusConfig[t.status] || statusConfig.SUBMITTED;
                const pc = projectColors[i % projectColors.length];
                return (
                  <tr key={t.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            flexShrink: 0,
                            background:
                              avatarColors[i % avatarColors.length].bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: avatarColors[i % avatarColors.length].text,
                          }}
                        >
                          {getInitials(
                            t.employee?.firstName,
                            t.employee?.lastName,
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#0f172a",
                            }}
                          >
                            {t.employee?.firstName} {t.employee?.lastName}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            {t.employee?.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {t.workDate}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#1e40af",
                          padding: "4px 12px",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        {t.hoursLogged}h
                      </span>
                    </td>
                    <td>
                      {t.project ? (
                        <span
                          style={{
                            background: pc.bg,
                            color: pc.color,
                            padding: "4px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {t.project}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.task || "—"}
                    </td>
                    <td>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          padding: "5px 14px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: sc.color,
                          }}
                        />
                        {sc.label}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        {t.status === "SUBMITTED" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(t.id)}
                            >
                              <MdCheck size={12} /> Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(t.id)}
                            >
                              <MdClose size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAssignment />
                      </div>
                      <div className="empty-title">No timesheet entries</div>
                      <div className="empty-sub">
                        {activeTab === "ALL"
                          ? 'Click "Log Time" to add an entry'
                          : `No ${activeTab.toLowerCase()} timesheets`}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timesheets;
