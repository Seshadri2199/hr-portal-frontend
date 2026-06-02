import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { employeeAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import EmployeeProfile from "../pages/EmployeeProfile";
import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
} from "react-icons/md";
import { useState, useEffect } from "react";
import {
  attendanceAPI,
  leaveAPI,
  timesheetAPI,
  dashboardAPI,
} from "../services/api";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/employees", icon: <MdPeople size={20} />, label: "Staff" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
  { path: "/leave", icon: <MdEventNote size={20} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheet" },
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
            HR Staff Portal
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
            fontFamily: "var(--font-display)",
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
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const avatarColors = [
    "avatar-blue",
    "avatar-green",
    "avatar-orange",
    "avatar-purple",
    "avatar-red",
    "avatar-teal",
  ];
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
      setEmployees(empRes.data.slice(0, 10));
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
          <div className="page-subtitle">View-only access to HR data</div>
        </div>
      </div>

      <div className="metrics-grid">
        {[
          {
            label: "Total Employees",
            value: stats?.totalActiveEmployees || 0,
            color: "slate",
          },
          {
            label: "Present Today",
            value: stats?.presentToday || 0,
            color: "green",
          },
          {
            label: "Pending Leave",
            value: stats?.pendingLeaveApprovals || 0,
            color: "orange",
          },
          {
            label: "Pending Sheets",
            value: stats?.pendingTimesheets || 0,
            color: "red",
          },
        ].map((m, i) => (
          <div className="metric-card" key={i}>
            <div className={`metric-icon ${m.color}`}>
              {i === 0 ? (
                <MdPeople size={24} />
              ) : i === 1 ? (
                <MdAccessTime size={24} />
              ) : i === 2 ? (
                <MdEventNote size={24} />
              ) : (
                <MdAssignment size={24} />
              )}
            </div>
            <div className="metric-info">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
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
                        className={`avatar ${avatarColors[i % avatarColors.length]}`}
                      >
                        {getInitials(emp.firstName, emp.lastName)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#334155",
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
                  <td>{emp.department?.name || "—"}</td>
                  <td>{emp.designation?.title || "—"}</td>
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

const StaffViewAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await attendanceAPI.getByDate(today);
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Attendance</div>
          <div className="page-subtitle">
            View only — contact HR Manager to make changes
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid #fde68a",
          }}
        >
          👁 View Only
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Today's Attendance</div>
          <div className="card-subtitle">{attendance.length} records</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700 }}>
                    {a.employee?.firstName} {a.employee?.lastName}
                  </td>
                  <td style={{ color: "#16a34a", fontWeight: 700 }}>
                    {formatTime(a.checkIn)}
                  </td>
                  <td style={{ color: "#d97706", fontWeight: 700 }}>
                    {formatTime(a.checkOut)}
                  </td>
                  <td>
                    {a.workingMinutes > 0
                      ? `${Math.floor(a.workingMinutes / 60)}h ${a.workingMinutes % 60}m`
                      : "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${a.status?.toLowerCase()}`}>
                      ● {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: "#94a3b8",
                    }}
                  >
                    No records today
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

const StaffViewLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveAPI
      .getAll()
      .then((res) => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Leave Requests</div>
          <div className="page-subtitle">
            View only — contact HR Manager to approve
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid #fde68a",
          }}
        >
          👁 View Only
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Leave Requests</div>
          <div className="card-subtitle">{leaves.length} records</div>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
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
                  <td>
                    <span className={`badge badge-${l.status?.toLowerCase()}`}>
                      ● {l.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: "#94a3b8",
                    }}
                  >
                    No records
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

const StaffViewTimesheets = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timesheetAPI
      .getPending()
      .then((res) => setTimesheets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Timesheets</div>
          <div className="page-subtitle">
            View only — contact HR Manager to approve
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid #fde68a",
          }}
        >
          👁 View Only
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Timesheets</div>
          <div className="card-subtitle">{timesheets.length} records</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700 }}>
                    {t.employee?.firstName} {t.employee?.lastName}
                  </td>
                  <td style={{ fontSize: 12 }}>{t.workDate}</td>
                  <td>
                    <span className="code-pill">{t.hoursLogged}h</span>
                  </td>
                  <td>{t.project || "—"}</td>
                  <td>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>
                      ● {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {timesheets.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: "#94a3b8",
                    }}
                  >
                    No records
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

const StaffViewEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const avatarColors = [
    "avatar-blue",
    "avatar-green",
    "avatar-orange",
    "avatar-purple",
    "avatar-red",
    "avatar-teal",
  ];
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
          <div className="page-subtitle">
            View only — contact Admin to add employees
          </div>
        </div>
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid #fde68a",
          }}
        >
          👁 View Only
        </div>
      </div>
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
                        className={`avatar ${avatarColors[i % avatarColors.length]}`}
                      >
                        {getInitials(emp.firstName, emp.lastName)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#334155",
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
                  <td>{emp.department?.name || "—"}</td>
                  <td>{emp.designation?.title || "—"}</td>
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
        <Route path="/attendance" element={<StaffViewAttendance />} />
        <Route path="/leave" element={<StaffViewLeave />} />
        <Route path="/timesheets" element={<StaffViewTimesheets />} />
      </Routes>
    </div>
  </div>
);

export default HRStaffPortal;
