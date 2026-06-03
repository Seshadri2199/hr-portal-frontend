import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { employeeAPI, leaveAPI, timesheetAPI } from "../services/api";
import logo from "../assets/logo.jpg";
import Leave from "../pages/Leave";
import Timesheets from "../pages/Timesheets";
import Attendance from "../pages/Attendance";
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdAccessTime,
  MdCheck,
  MdClose,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/leave", icon: <MdEventNote size={20} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheets" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
];

const avatarColors = [
  { bg: "#eff6ff", text: "#1e40af" },
  { bg: "#f0fdf4", text: "#166634" },
  { bg: "#fffbeb", text: "#92400e" },
  { bg: "#faf5ff", text: "#5b21b6" },
  { bg: "#fef2f2", text: "#991b1b" },
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
      {/* Brand with Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={logo}
          alt="TechNext HR"
          style={{ height: 65, width: "auto", objectFit: "contain" }}
        />
        <div
          style={{
            fontSize: 9.5,
            color: "#94a3b8",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Manager Portal
        </div>
      </div>

      {/* Clock */}
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

      {/* User */}
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
            {user.employeeCode}
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
        employeeAPI.getAll(),
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
      await leaveAPI.reject(id, user.employeeId, "Rejected by manager");
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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Team Dashboard</div>
          <div className="page-subtitle">
            Welcome back, {user.fullName?.split(" ")[0]}!
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: "Team Members",
            value: team.length,
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
            sub: "All employees",
          },
          {
            label: "Pending Leaves",
            value: pendingLeaves.length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
            sub: "Need approval",
          },
          {
            label: "Pending Timesheets",
            value: pendingSheets.length,
            color: "#7c3aed",
            bg: "#faf5ff",
            border: "#ddd6fe",
            sub: "Need review",
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
                fontSize: 30,
                fontWeight: 800,
                color: card.color,
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: 11, color: card.color, opacity: 0.65 }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Team members */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div className="card-title">All Employees</div>
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
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: avatarColors[i % avatarColors.length].bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: avatarColors[i % avatarColors.length].text,
                        }}
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
                    {emp.departmentName || "—"}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {emp.designationTitle || "—"}
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
                      <div className="empty-title">No employees found</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending leaves */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div className="card-title">Pending Leave Requests</div>
          <div className="card-subtitle">
            {pendingLeaves.length} awaiting approval
          </div>
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
                  <td>
                    <div style={{ fontWeight: 700 }}>
                      {l.employee?.firstName} {l.employee?.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {l.employee?.employeeCode}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1e40af",
                        padding: "3px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {l.leaveType?.name}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                  <td style={{ fontSize: 12 }}>{l.toDate}</td>
                  <td style={{ fontWeight: 800 }}>{l.totalDays}d</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>
                    {l.reason || "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveLeave(l.id)}
                      >
                        <MdCheck size={12} /> Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectLeave(l.id)}
                      >
                        <MdClose size={12} /> Reject
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

      {/* Pending timesheets */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Pending Timesheets</div>
          <div className="card-subtitle">
            {pendingSheets.length} awaiting approval
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSheets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>
                      {t.employee?.firstName} {t.employee?.lastName}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {t.employee?.employeeCode}
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{t.workDate}</td>
                  <td>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1e40af",
                        padding: "3px 10px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {t.hoursLogged}h
                    </span>
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
                      <MdCheck size={12} /> Approve
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
        <Route path="/leave" element={<Leave user={user} />} />
        <Route path="/timesheets" element={<Timesheets user={user} />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </div>
  </div>
);

export default ManagerPortal;
