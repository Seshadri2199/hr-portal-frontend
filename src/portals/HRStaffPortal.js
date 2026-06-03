import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  employeeAPI,
  leaveAPI,
  timesheetAPI,
  dashboardAPI,
} from "../services/api";
import logo from "../assets/logo.jpg";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Timesheets from "../pages/Timesheets";
import EmployeeProfile from "../pages/EmployeeProfile";
import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/employees", icon: <MdPeople size={20} />, label: "Staff" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
  { path: "/leave", icon: <MdEventNote size={20} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheet" },
];

const avatarColors = [
  { bg: "#eff6ff", text: "#1e40af" },
  { bg: "#f0fdf4", text: "#166534" },
  { bg: "#fffbeb", text: "#92400e" },
  { bg: "#faf5ff", text: "#5b21b6" },
  { bg: "#fef2f2", text: "#991b1b" },
  { bg: "#f0fdfa", text: "#134e4a" },
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
          HR Staff Portal
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
          HR STAFF
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
            {user.fullName || "HR Staff"}
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
          {user.fullName?.charAt(0)?.toUpperCase() || "S"}
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

const ViewOnlyBanner = () => (
  <div
    style={{
      background: "#fef3c7",
      border: "1px solid #fde68a",
      borderRadius: 10,
      padding: "10px 16px",
      marginBottom: 18,
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      color: "#92400e",
      fontWeight: 600,
    }}
  >
    👁 View Only — Contact HR Manager to make changes
  </div>
);

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashRes, empRes] = await Promise.all([
        dashboardAPI.get(),
        employeeAPI.getActive(),
      ]);
      setStats(dashRes.data);
      setEmployees(empRes.data.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">HR Staff Dashboard</div>
          <div className="page-subtitle">Read-only access to HR data</div>
        </div>
      </div>
      <ViewOnlyBanner />

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
            label: "Total Employees",
            value: stats?.totalActiveEmployees || 0,
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Present Today",
            value: stats?.presentToday || 0,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Pending Leave",
            value: stats?.pendingLeaveApprovals || 0,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Pending Sheets",
            value: stats?.pendingTimesheets || 0,
            color: "#7c3aed",
            bg: "#faf5ff",
            border: "#ddd6fe",
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
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Employees</div>
          <div className="card-subtitle">{employees.length} records</div>
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
              {employees.map((emp, i) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
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
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#0f172a",
                          }}
                        >
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StaffViewEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  useEffect(() => {
    employeeAPI
      .getAll()
      .then((res) => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">View only</div>
        </div>
      </div>
      <ViewOnlyBanner />
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Employees</div>
          <div className="card-subtitle">{employees.length} records</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Code</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
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
                    <span
                      className={`badge badge-${emp.employmentType?.toLowerCase()}`}
                    >
                      {emp.employmentType?.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-active">● Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const HRStaffPortal = ({ user, onLogout }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div className="main-layout">
      <Topbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<StaffDashboard />} />
        <Route path="/employees" element={<StaffViewEmployees />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave user={user} />} />
        <Route path="/timesheets" element={<Timesheets user={user} />} />
      </Routes>
    </div>
  </div>
);

export default HRStaffPortal;
