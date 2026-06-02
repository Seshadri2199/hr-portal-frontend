import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { employeeAPI, leaveAPI, timesheetAPI } from "../services/api";
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdAccessTime,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/my-team", icon: <MdPeople size={20} />, label: "Team" },
  { path: "/approvals", icon: <MdEventNote size={20} />, label: "Approvals" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheets" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
];

const avatarColors = [
  "avatar-blue",
  "avatar-green",
  "avatar-orange",
  "avatar-purple",
  "avatar-red",
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">H</div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      <div className="sidebar-spacer" />
    </div>
  );
};

const Topbar = ({ user, onLogout }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(51,65,85,0.25)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 14,
              fontFamily: "var(--font-display)",
            }}
          >
            T
          </span>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.3px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            TECHNEXT <span style={{ color: "#334155" }}>HR</span>
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: "#94a3b8",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Manager Portal
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "#f8fafc",
          padding: "7px 14px",
          borderRadius: 9,
          border: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
          }}
        />
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1,
            }}
          >
            {timeStr}
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: "#94a3b8",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {dateStr}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            background: "#f1f5f9",
            color: "#334155",
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 9.5,
            fontWeight: 700,
            border: "1px solid #e2e8f0",
            letterSpacing: "0.5px",
          }}
        >
          MANAGER
        </div>
        <div style={{ width: 1, height: 24, background: "#f1f5f9" }} />
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1,
            }}
          >
            {user.fullName || "Manager"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            {user.employeeCode || "Manager"}
          </div>
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {user.fullName?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <button
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.borderColor = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
          style={{
            padding: "6px 13px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 150ms",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const ManagerDashboard = ({ user }) => {
  const [team, setTeam] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingSheets, setPendingSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, leaveRes, tsRes] = await Promise.all([
        employeeAPI.getReportees(user.employeeId),
        leaveAPI.getPending(),
        timesheetAPI.getPending(),
      ]);
      setTeam(empRes.data);
      setPendingLeaves(leaveRes.data);
      setPendingSheets(tsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (id) => {
    try {
      await leaveAPI.approve(id, user.employeeId);
      loadData();
    } catch (err) {
      alert("Error approving leave");
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await leaveAPI.reject(id, user.employeeId, "Rejected");
      loadData();
    } catch (err) {
      alert("Error rejecting leave");
    }
  };

  const handleApproveSheet = async (id) => {
    try {
      await timesheetAPI.approve(id, user.employeeId);
      loadData();
    } catch (err) {
      alert("Error approving timesheet");
    }
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  if (loading)
    return <div className="loading">Loading manager dashboard...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Team Dashboard</div>
          <div className="page-subtitle">Welcome back, {user.fullName}!</div>
        </div>
      </div>

      <div
        className="metrics-grid"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        <div className="metric-card">
          <div className="metric-icon slate">
            <MdPeople size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Team Members</div>
            <div className="metric-value">{team.length}</div>
            <div className="metric-change">Direct reportees</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon orange">
            <MdEventNote size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Pending Leaves</div>
            <div className="metric-value">{pendingLeaves.length}</div>
            <div className="metric-change" style={{ color: "#d97706" }}>
              Need approval
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon green">
            <MdAssignment size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Pending Timesheets</div>
            <div className="metric-value">{pendingSheets.length}</div>
            <div className="metric-change">Need review</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div className="card-title">My Team</div>
          <div className="card-subtitle">{team.length} members</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Code</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map((emp, i) => (
                <tr key={emp.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        className={`avatar ${avatarColors[i % avatarColors.length]}`}
                      >
                        {getInitials(emp.firstName, emp.lastName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="code-pill">{emp.employeeCode}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {emp.department?.name || "—"}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {emp.designation?.title || "—"}
                  </td>
                  <td>
                    <span className="badge badge-active">● Active</span>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdPeople />
                      </div>
                      <div className="empty-title">No team members</div>
                      <div className="empty-sub">No reportees assigned yet</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div className="card-title">Pending Leave Requests</div>
          <div className="card-subtitle">{pendingLeaves.length} awaiting</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 700 }}>
                    {l.employee?.firstName} {l.employee?.lastName}
                  </td>
                  <td>
                    <span className="code-pill">{l.leaveType?.name}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                  <td style={{ fontSize: 12 }}>{l.toDate}</td>
                  <td style={{ fontWeight: 800 }}>{l.totalDays}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>
                    {l.reason || "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveLeave(l.id)}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectLeave(l.id)}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingLeaves.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdEventNote />
                      </div>
                      <div className="empty-title">No pending leaves</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Pending Timesheets</div>
          <div className="card-subtitle">{pendingSheets.length} awaiting</div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSheets.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700 }}>
                    {t.employee?.firstName} {t.employee?.lastName}
                  </td>
                  <td style={{ fontSize: 12 }}>{t.workDate}</td>
                  <td>
                    <span className="code-pill">{t.hoursLogged}h</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.project || "—"}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>
                    {t.task || "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApproveSheet(t.id)}
                    >
                      ✓ Approve
                    </button>
                  </td>
                </tr>
              ))}
              {pendingSheets.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAssignment />
                      </div>
                      <div className="empty-title">No pending timesheets</div>
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

const ManagerPortal = ({ user, onLogout }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div className="main-layout">
      <Topbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<ManagerDashboard user={user} />} />
      </Routes>
    </div>
  </div>
);

export default ManagerPortal;
