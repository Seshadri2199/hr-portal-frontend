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
import Settings from "../pages/Settings";
import Announcements from "../pages/Announcements";
import {
  MdGridView,
  MdGroups,
  MdFingerprint,
  MdBeachAccess,
  MdEditCalendar,
  MdAutoGraph,
  MdInsights,
  MdTune,
  MdCampaign,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdGridView size={24} />, label: "Home" },
  { path: "/employees", icon: <MdGroups size={24} />, label: "Staff" },
  { path: "/attendance", icon: <MdFingerprint size={24} />, label: "Time" },
  { path: "/leave", icon: <MdBeachAccess size={24} />, label: "Leave" },
  { path: "/timesheets", icon: <MdEditCalendar size={24} />, label: "Sheet" },
  { path: "/career", icon: <MdAutoGraph size={24} />, label: "Career" },
  { path: "/reports", icon: <MdInsights size={24} />, label: "Reports" },
  { path: "/announcements", icon: <MdCampaign size={24} />, label: "News" },
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
          data-tooltip={item.label}
          className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      <div className="sidebar-spacer" />
      <Link
        to="/settings"
        data-tooltip="Settings"
        className={`sidebar-item ${location.pathname === "/settings" ? "active" : ""}`}
      >
        <MdTune size={24} /> Settings
      </Link>
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
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
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
              fontSize: 15,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.3px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            TECHNEXT <span style={{ color: "#3b82f6" }}>HR</span>
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
            Admin Portal
          </div>
        </div>
      </div>

      {/* Clock */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "var(--gray-50)",
          padding: "7px 14px",
          borderRadius: 9,
          border: "1px solid var(--gray-100)",
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
            letterSpacing: "0.5px",
          }}
        >
          {user.role}
        </div>
        <div style={{ width: 1, height: 24, background: "var(--gray-100)" }} />
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
            {user.fullName || "Admin"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            {user.employeeCode || "Administrator"}
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            flexShrink: 0,
            border: "2px solid rgba(59,130,246,0.3)",
          }}
        >
          {user.fullName?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <button
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.borderColor = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "var(--gray-200)";
          }}
          style={{
            padding: "7px 16px",
            borderRadius: 9,
            border: "1px solid var(--gray-200)",
            background: "#fff",
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 150ms",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const AdminPortal = ({ user, onLogout }) => (
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
        <Route path="/announcements" element={<Announcements user={user} />} />
        <Route
          path="/settings"
          element={<Settings user={user} onLogout={onLogout} />}
        />
      </Routes>
    </div>
  </div>
);

export default AdminPortal;
