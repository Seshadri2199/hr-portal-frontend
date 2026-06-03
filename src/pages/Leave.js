import React, { useState, useEffect } from "react";
import { leaveAPI, employeeAPI } from "../services/api";
import {
  MdEventNote,
  MdAdd,
  MdCheck,
  MdClose,
  MdCalendarToday,
} from "react-icons/md";

const leaveTypeColors = {
  "Casual Leave": {
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
    bar: "#16a34a",
  },
  "Sick Leave": {
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
    bar: "#2563eb",
  },
  "Earned Leave": {
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    bar: "#d97706",
  },
  "Maternity Leave": {
    bg: "#faf5ff",
    color: "#7c3aed",
    border: "#ddd6fe",
    bar: "#7c3aed",
  },
  "Loss of Pay": {
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecdd3",
    bar: "#dc2626",
  },
};

const statusConfig = {
  PENDING: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
  APPROVED: { bg: "#f0fdf4", color: "#166534", label: "Approved" },
  REJECTED: { bg: "#fef2f2", color: "#991b1b", label: "Rejected" },
  CANCELLED: { bg: "#f1f5f9", color: "#475569", label: "Cancelled" },
};

const tabColors = {
  ALL: { active: "#0f172a", text: "#fff" },
  PENDING: { active: "#d97706", text: "#fff", dot: "#d97706" },
  APPROVED: { active: "#16a34a", text: "#fff", dot: "#16a34a" },
  REJECTED: { active: "#dc2626", text: "#fff", dot: "#dc2626" },
  CANCELLED: { active: "#64748b", text: "#fff", dot: "#64748b" },
};

const Leave = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    totalDays: 1,
    reason: "",
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [leavesRes, typesRes, empRes] = await Promise.all([
        leaveAPI.getAll(),
        leaveAPI.getTypes(),
        employeeAPI.getActive(),
      ]);
      setLeaves(leavesRes.data);
      setLeaveTypes(typesRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcDays = (from, to) => {
    if (!from || !to) return 1;
    const diff =
      Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diff, 1);
  };

  const handleFromDate = (val) => {
    setForm({ ...form, fromDate: val, totalDays: calcDays(val, form.toDate) });
  };

  const handleToDate = (val) => {
    setForm({ ...form, toDate: val, totalDays: calcDays(form.fromDate, val) });
  };

  const handleSubmit = async () => {
    if (
      !form.employeeId ||
      !form.leaveTypeId ||
      !form.fromDate ||
      !form.toDate
    ) {
      alert("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await leaveAPI.apply({
        employee: { id: form.employeeId },
        leaveType: { id: form.leaveTypeId },
        fromDate: form.fromDate,
        toDate: form.toDate,
        totalDays: form.totalDays,
        reason: form.reason,
      });
      setShowForm(false);
      setForm({
        employeeId: "",
        leaveTypeId: "",
        fromDate: "",
        toDate: "",
        totalDays: 1,
        reason: "",
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
      await leaveAPI.approve(id, user?.employeeId || 4);
      loadAll();
    } catch (err) {
      alert("Error approving: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    const note =
      window.prompt("Reason for rejection (optional):") ||
      "Rejected by manager";
    try {
      await leaveAPI.reject(id, user?.employeeId || 4, note);
      loadAll();
    } catch (err) {
      alert("Error rejecting: " + (err.response?.data?.message || err.message));
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const avatarColors = ["#eff6ff", "#f0fdf4", "#fffbeb", "#faf5ff", "#fef2f2"];
  const avatarTextColors = [
    "#1e40af",
    "#166534",
    "#92400e",
    "#5b21b6",
    "#991b1b",
  ];

  const tabs = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];
  const filtered =
    activeTab === "ALL" ? leaves : leaves.filter((l) => l.status === activeTab);
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

  const leaveBalances = leaveTypes.map((type) => {
    const used = leaves
      .filter((l) => l.leaveType?.id === type.id && l.status === "APPROVED")
      .reduce((sum, l) => sum + (l.totalDays || 0), 0);
    const total = type.maxDaysPerYear || 12;
    const remaining = Math.max(total - used, 0);
    const pct = Math.min((used / total) * 100, 100);
    const c = leaveTypeColors[type.name] || {
      bg: "#f1f5f9",
      color: "#475569",
      border: "#e2e8f0",
      bar: "#475569",
    };
    return { ...type, used, total, remaining, pct, c };
  });

  if (loading)
    return (
      <div className="loading">
        <MdEventNote size={28} />
        Loading leave data...
      </div>
    );

  return (
    <div className="content">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Leave Management</div>
          <div className="page-subtitle">
            {leaves.length} total · {pendingCount} pending approval
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {leaveBalances.map((lb) => (
          <div
            key={lb.id}
            style={{
              background: lb.c.bg,
              border: `1px solid ${lb.c.border}`,
              borderRadius: 14,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: lb.c.color,
                marginBottom: 8,
              }}
            >
              {lb.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: lb.c.color,
                  lineHeight: 1,
                }}
              >
                {lb.remaining}
              </span>
              <span style={{ fontSize: 12, color: lb.c.color, opacity: 0.6 }}>
                / {lb.total} days
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: "rgba(0,0,0,0.08)",
                borderRadius: 4,
                overflow: "hidden",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: `${lb.pct}%`,
                  height: "100%",
                  background: lb.c.bar,
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: lb.c.color, opacity: 0.65 }}>
              {lb.used} used of {lb.total}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Leave Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 22 }}>
          <div className="card-header">
            <div>
              <div className="card-title">New Leave Application</div>
              <div className="card-subtitle">
                Days auto-calculated from selected dates
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
                <label className="form-label">Leave Type *</label>
                <select
                  className="form-control"
                  value={form.leaveTypeId}
                  onChange={(e) =>
                    setForm({ ...form, leaveTypeId: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  {leaveTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Days</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.totalDays}
                  readOnly
                  style={{
                    background: "#f8fafc",
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: 16,
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">From Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.fromDate}
                  onChange={(e) => handleFromDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">To Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.toDate}
                  onChange={(e) => handleToDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reason for leave"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            </div>

            {form.employeeId &&
              form.leaveTypeId &&
              form.fromDate &&
              form.toDate && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    color: "#166534",
                    fontWeight: 500,
                  }}
                >
                  <MdCalendarToday size={16} />
                  <span>
                    <strong>
                      {
                        employees.find(
                          (e) => String(e.id) === String(form.employeeId),
                        )?.firstName
                      }
                    </strong>{" "}
                    will be on leave for
                    <strong>
                      {" "}
                      {form.totalDays} day{form.totalDays > 1 ? "s" : ""}
                    </strong>{" "}
                    — from <strong>{form.fromDate}</strong> to{" "}
                    <strong>{form.toDate}</strong>
                  </span>
                </div>
              )}

            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Submitting..." : "Submit Application"}
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

      {/* Leave Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Leave Requests</div>
            <div className="card-subtitle">{filtered.length} records</div>
          </div>

          {/* Styled Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {tabs.map((tab) => {
              const tc = tabColors[tab];
              const isActive = activeTab === tab;
              const count =
                tab === "ALL"
                  ? leaves.length
                  : leaves.filter((l) => l.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    background: isActive ? tc.active : "#f1f5f9",
                    color: isActive ? tc.text : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 150ms",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
                  }}
                >
                  {tc.dot && (
                    <span
                      style={{
                        width: 7,
                        height: 7,
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
                      padding: "1px 7px",
                      fontSize: 10,
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
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => {
                const sc = statusConfig[l.status] || statusConfig.PENDING;
                const tc = leaveTypeColors[l.leaveType?.name] || {
                  bg: "#f1f5f9",
                  color: "#475569",
                };
                const empName =
                  `${l.employee?.firstName || ""} ${l.employee?.lastName || ""}`.trim();
                return (
                  <tr key={l.id}>
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
                            background: avatarColors[i % avatarColors.length],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color:
                              avatarTextColors[i % avatarTextColors.length],
                          }}
                        >
                          {getInitials(empName)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#0f172a",
                            }}
                          >
                            {empName}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            {l.employee?.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          background: tc.bg,
                          color: tc.color,
                          padding: "4px 12px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {l.leaveType?.name}
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {l.fromDate}
                    </td>
                    <td
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {l.toDate}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: "#0f172a",
                          padding: "4px 12px",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {l.totalDays}d
                      </span>
                    </td>
                    <td
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.reason || "—"}
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
                            display: "inline-block",
                          }}
                        />
                        {sc.label}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        {l.status === "PENDING" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(l.id)}
                            >
                              <MdCheck size={12} /> Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(l.id)}
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
                  <td colSpan={isAdmin ? 8 : 7}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdEventNote />
                      </div>
                      <div className="empty-title">No leave requests</div>
                      <div className="empty-sub">
                        {activeTab === "ALL"
                          ? 'Click "Apply Leave" to submit a request'
                          : `No ${activeTab.toLowerCase()} leave requests`}
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

export default Leave;
