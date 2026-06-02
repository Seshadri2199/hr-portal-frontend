import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Timesheets from "../pages/Timesheets";
import CareerHistory from "../pages/CareerHistory";
import EmployeeProfile from "../pages/EmployeeProfile";
import Reports from "../pages/Reports";
import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdTimeline,
  MdBarChart,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/employees", icon: <MdPeople size={20} />, label: "Staff" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
  { path: "/leave", icon: <MdEventNote size={20} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheet" },
  { path: "/career", icon: <MdTimeline size={20} />, label: "Career" },
  { path: "/reports", icon: <MdBarChart size={20} />, label: "Reports" },
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
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
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
            HR Manager Portal
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
          HR MANAGER
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
            {user.fullName || "HR Manager"}
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
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {user.fullName?.charAt(0)?.toUpperCase() || "H"}
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

const HRManagerPortal = ({ user, onLogout }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div className="main-layout">
      <Topbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/timesheets" element={<Timesheets />} />
        <Route path="/career" element={<CareerHistory />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  </div>
);

export default HRManagerPortal;
