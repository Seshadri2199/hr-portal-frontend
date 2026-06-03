import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  attendanceAPI,
  leaveAPI,
  timesheetAPI,
  announcementAPI,
} from "../services/api";
import logo from "../assets/logo.jpg";
import Announcements from "../pages/Announcements";
import Leave from "../pages/Leave";
import {
  MdDashboard,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdCampaign,
  MdAdd,
  MdClose,
  MdArrowForward,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={20} />, label: "Home" },
  { path: "/attendance", icon: <MdAccessTime size={20} />, label: "Time" },
  { path: "/leave", icon: <MdEventNote size={20} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={20} />, label: "Sheet" },
  { path: "/announcements", icon: <MdCampaign size={20} />, label: "News" },
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
          Employee Portal
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
          EMPLOYEE
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
            {user.fullName}
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
            cursor: "pointer",
            flexShrink: 0,
            border: "2px solid rgba(59,130,246,0.3)",
          }}
        >
          {user.fullName?.charAt(0)?.toUpperCase() || "E"}
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
            padding: "7px 16px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 150ms",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// ── DASHBOARD ───────────────────────────────────
const EmployeeDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [todayAtt, setTodayAtt] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [mySheets, setMySheets] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attRes, leaveRes, tsRes, typesRes, annRes] = await Promise.all([
        attendanceAPI.getToday(user.employeeId),
        leaveAPI.getByEmployee(user.employeeId),
        timesheetAPI.getByEmployee(user.employeeId),
        leaveAPI.getTypes(),
        announcementAPI.getActive(),
      ]);
      setTodayAtt(attRes.data);
      setMyLeaves(leaveRes.data);
      setMySheets(tsRes.data);
      setLeaveTypes(typesRes.data);
      setAnnouncements(annRes.data?.slice(0, 3) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leaveBalances = leaveTypes.map((type) => {
    const used = myLeaves
      .filter((l) => l.leaveType?.id === type.id && l.status === "APPROVED")
      .reduce((sum, l) => sum + (l.totalDays || 0), 0);
    const total = type.maxDaysPerYear || 12;
    const remaining = Math.max(total - used, 0);
    const pct = Math.min((used / total) * 100, 100);
    const colors = {
      "Casual Leave": {
        bg: "#f0fdf4",
        color: "#16a34a",
        bar: "#16a34a",
        border: "#bbf7d0",
      },
      "Sick Leave": {
        bg: "#eff6ff",
        color: "#2563eb",
        bar: "#2563eb",
        border: "#bfdbfe",
      },
      "Earned Leave": {
        bg: "#fffbeb",
        color: "#d97706",
        bar: "#d97706",
        border: "#fde68a",
      },
      "Maternity Leave": {
        bg: "#faf5ff",
        color: "#7c3aed",
        bar: "#7c3aed",
        border: "#ddd6fe",
      },
      "Loss of Pay": {
        bg: "#fef2f2",
        color: "#dc2626",
        bar: "#dc2626",
        border: "#fecdd3",
      },
    };
    const c = colors[type.name] || {
      bg: "#f1f5f9",
      color: "#475569",
      bar: "#475569",
      border: "#e2e8f0",
    };
    return { ...type, used, total, remaining, pct, c };
  });

  const isWorking = todayAtt?.checkIn && !todayAtt?.checkOut;
  const pendingLeaves = myLeaves.filter((l) => l.status === "PENDING").length;
  const approvedLeaves = myLeaves.filter((l) => l.status === "APPROVED").length;
  const totalHours = mySheets.reduce(
    (s, t) => s + parseFloat(t.hoursLogged || 0),
    0,
  );

  const priorityColors = {
    LOW: { color: "#64748b", bg: "#f1f5f9" },
    NORMAL: { color: "#2563eb", bg: "#eff6ff" },
    HIGH: { color: "#d97706", bg: "#fffbeb" },
    URGENT: { color: "#dc2626", bg: "#fef2f2" },
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="content">
      {/* Greeting Header */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}
          >
            {greeting()}, {user.fullName?.split(" ")[0]}! 👋
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              background: !todayAtt
                ? "rgba(255,255,255,0.08)"
                : isWorking
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(245,158,11,0.15)",
              border: `1px solid ${!todayAtt ? "rgba(255,255,255,0.1)" : isWorking ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
              borderRadius: 12,
              padding: "10px 18px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 4,
              }}
            >
              Today
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: !todayAtt
                  ? "#94a3b8"
                  : isWorking
                    ? "#22c55e"
                    : "#f59e0b",
              }}
            >
              {!todayAtt
                ? "Not checked in"
                : isWorking
                  ? "● Working"
                  : `Done · ${Math.floor((todayAtt.workingMinutes || 0) / 60)}h ${(todayAtt.workingMinutes || 0) % 60}m`}
            </div>
          </div>
          <button
            onClick={() => navigate("/attendance")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MdAccessTime size={16} /> Attendance
          </button>
          <button
            onClick={() => navigate("/leave")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MdEventNote size={16} /> Apply Leave
          </button>
          <button
            onClick={() => navigate("/timesheets")}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MdAssignment size={16} /> Log Time
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Total Leaves",
            value: myLeaves.length,
            sub: `${approvedLeaves} approved`,
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Pending Leaves",
            value: pendingLeaves,
            sub: "Awaiting approval",
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Timesheets",
            value: mySheets.length,
            sub: `${totalHours.toFixed(0)}h logged`,
            color: "#7c3aed",
            bg: "#faf5ff",
            border: "#ddd6fe",
          },
          {
            label: "Hours Logged",
            value: `${totalHours.toFixed(1)}h`,
            sub: "Total this period",
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: card.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 6,
                opacity: 0.8,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 26,
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

      {/* Leave Balances + Announcements */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div className="card">
          <div className="card-header">
            <div className="card-title">Leave Balance</div>
            <button
              onClick={() => navigate("/leave")}
              style={{
                fontSize: 12,
                color: "#3b82f6",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              Apply Leave <MdArrowForward size={14} />
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {leaveBalances.map((lb, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {lb.name}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: lb.c.color,
                      }}
                    >
                      {lb.remaining}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#94a3b8",
                        }}
                      >
                        /{lb.total}d
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#f1f5f9",
                      borderRadius: 4,
                      overflow: "hidden",
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
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                    {lb.used} used of {lb.total}
                  </div>
                </div>
              ))}
              {leaveBalances.length === 0 && (
                <div
                  style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}
                >
                  No leave types configured
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📢 Announcements</div>
            <button
              onClick={() => navigate("/announcements")}
              style={{
                fontSize: 12,
                color: "#3b82f6",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              View all <MdArrowForward size={14} />
            </button>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            {announcements.length > 0 ? (
              announcements.map((ann, i) => {
                const pc =
                  priorityColors[ann.priority] || priorityColors.NORMAL;
                return (
                  <div
                    key={ann.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom:
                        i < announcements.length - 1
                          ? "1px solid #f1f5f9"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: pc.color,
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0f172a",
                          marginBottom: 3,
                        }}
                      >
                        {ann.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {ann.content?.length > 80
                          ? ann.content.substring(0, 80) + "..."
                          : ann.content}
                      </div>
                    </div>
                    <span
                      style={{
                        background: pc.bg,
                        color: pc.color,
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontSize: 9,
                        fontWeight: 700,
                        height: "fit-content",
                        flexShrink: 0,
                      }}
                    >
                      {ann.priority}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="empty-state" style={{ padding: 20 }}>
                <div className="empty-icon">
                  <MdCampaign />
                </div>
                <div className="empty-title">No announcements</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leave + Timesheets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Leave Requests</div>
            <button
              onClick={() => navigate("/leave")}
              style={{
                fontSize: 12,
                color: "#3b82f6",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              View all <MdArrowForward size={14} />
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.slice(0, 4).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#1e40af",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {l.leaveType?.name}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: "#64748b" }}>
                      {l.fromDate} → {l.toDate}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 13 }}>
                      {l.totalDays}d
                    </td>
                    <td>
                      <span
                        className={`badge badge-${l.status?.toLowerCase()}`}
                      >
                        ● {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myLeaves.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state" style={{ padding: 24 }}>
                        <div className="empty-title">No leave requests</div>
                        <div className="empty-sub">Click Apply Leave above</div>
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
            <div className="card-title">My Timesheets</div>
            <button
              onClick={() => navigate("/timesheets")}
              style={{
                fontSize: 12,
                color: "#3b82f6",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
              }}
            >
              Log Time <MdArrowForward size={14} />
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mySheets.slice(0, 4).map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontSize: 12, color: "#64748b" }}>
                      {t.workDate}
                    </td>
                    <td>
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#1e40af",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {t.hoursLogged}h
                      </span>
                    </td>
                    <td style={{ fontSize: 12, fontWeight: 600 }}>
                      {t.project || "—"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${t.status?.toLowerCase()}`}
                      >
                        ● {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {mySheets.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state" style={{ padding: 24 }}>
                        <div className="empty-title">No timesheets</div>
                        <div className="empty-sub">Click Log Time above</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ATTENDANCE PAGE ─────────────────────────────
const MyAttendance = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [todayAtt, setTodayAtt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (todayAtt?.checkIn && !todayAtt?.checkOut) {
      const checkInTime = new Date(todayAtt.checkIn).getTime();
      const update = () =>
        setLiveSeconds(Math.floor((Date.now() - checkInTime) / 1000));
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    } else if (todayAtt?.workingMinutes) {
      setLiveSeconds(todayAtt.workingMinutes * 60);
    } else {
      setLiveSeconds(0);
    }
  }, [todayAtt]);

  const loadData = async () => {
    try {
      const [attRes, todayRes] = await Promise.all([
        attendanceAPI.getByEmployee(user.employeeId),
        attendanceAPI.getToday(user.employeeId),
      ]);
      setAttendance(attRes.data);
      setTodayAtt(todayRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceAPI.checkIn(user.employeeId);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error checking in");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      await attendanceAPI.checkOut(user.employeeId);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error checking out");
    } finally {
      setCheckingOut(false);
    }
  };

  const pad = (n) => String(n).padStart(2, "0");
  const formatLiveTimer = (s) =>
    `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  const calcDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const totalSecs = Math.floor(
      (new Date(checkOut) - new Date(checkIn)) / 1000,
    );
    return `${Math.floor(totalSecs / 3600)}h ${Math.floor((totalSecs % 3600) / 60)}m ${totalSecs % 60}s`;
  };
  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "—";
  const isWorking = todayAtt?.checkIn && !todayAtt?.checkOut;

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">My Attendance</div>
          <div className="page-subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Today's Status</div>
            <div className="card-subtitle">
              {new Date().toLocaleDateString()}
            </div>
          </div>
          {liveSeconds > 0 && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 26,
                fontWeight: 800,
                color: isWorking ? "#16a34a" : "#d97706",
                letterSpacing: "2px",
                background: isWorking ? "#f0fdf4" : "#fffbeb",
                padding: "10px 20px",
                borderRadius: 12,
                border: `1px solid ${isWorking ? "#bbf7d0" : "#fde68a"}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {isWorking && (
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#16a34a",
                    display: "inline-block",
                    boxShadow: "0 0 0 3px rgba(22,163,74,0.2)",
                  }}
                />
              )}
              {formatLiveTimer(liveSeconds)}
            </div>
          )}
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                background: "#f0fdf4",
                borderRadius: 12,
                padding: "16px 18px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#16a34a",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 6,
                }}
              >
                Check In
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: todayAtt?.checkIn ? "#16a34a" : "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {formatTime(todayAtt?.checkIn)}
              </div>
            </div>
            <div
              style={{
                background: "#fffbeb",
                borderRadius: 12,
                padding: "16px 18px",
                border: "1px solid #fde68a",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#d97706",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 6,
                }}
              >
                Check Out
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: todayAtt?.checkOut ? "#d97706" : "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {formatTime(todayAtt?.checkOut)}
              </div>
            </div>
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: 12,
                padding: "16px 18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 6,
                }}
              >
                Duration
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#334155",
                  fontFamily: "monospace",
                }}
              >
                {isWorking
                  ? formatLiveTimer(liveSeconds)
                  : calcDuration(todayAtt?.checkIn, todayAtt?.checkOut) || "—"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 10,
                border: "none",
                background: checkingIn ? "#f1f5f9" : "#16a34a",
                color: checkingIn ? "#94a3b8" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: checkingIn ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 150ms",
                boxShadow: checkingIn
                  ? "none"
                  : "0 4px 12px rgba(22,163,74,0.3)",
              }}
            >
              {checkingIn ? "⏳ Checking in..." : "→ Check In"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={checkingOut}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 10,
                border: "none",
                background: checkingOut ? "#f1f5f9" : "#d97706",
                color: checkingOut ? "#94a3b8" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: checkingOut ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 150ms",
                boxShadow: checkingOut
                  ? "none"
                  : "0 4px 12px rgba(217,119,6,0.3)",
              }}
            >
              {checkingOut ? "⏳ Checking out..." : "← Check Out"}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Attendance History</div>
          <div className="card-subtitle">{attendance.length} records</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.attendanceDate}</td>
                  <td
                    style={{
                      color: "#16a34a",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {formatTime(a.checkIn)}
                  </td>
                  <td
                    style={{
                      color: "#d97706",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {a.checkOut ? (
                      formatTime(a.checkOut)
                    ) : (
                      <span
                        style={{
                          color: "#16a34a",
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#f0fdf4",
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        ● In progress
                      </span>
                    )}
                  </td>
                  <td>
                    {calcDuration(a.checkIn, a.checkOut) ? (
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: "#0f172a",
                          padding: "3px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "monospace",
                        }}
                      >
                        {calcDuration(a.checkIn, a.checkOut)}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
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
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAccessTime />
                      </div>
                      <div className="empty-title">
                        No attendance records yet
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

// ── TIMESHEETS PAGE ─────────────────────────────
const MyTimesheets = ({ user }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    workDate: new Date().toISOString().split("T")[0],
    hoursLogged: "",
    project: "",
    task: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await timesheetAPI.getByEmployee(user.employeeId);
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.workDate || !form.hoursLogged) {
      alert("Please fill required fields");
      return;
    }
    setSaving(true);
    try {
      await timesheetAPI.create({
        employee: { id: user.employeeId },
        workDate: form.workDate,
        hoursLogged: parseFloat(form.hoursLogged),
        project: form.project,
        task: form.task,
        description: form.description,
        status: "SUBMITTED",
      });
      setShowForm(false);
      setForm({
        workDate: new Date().toISOString().split("T")[0],
        hoursLogged: "",
        project: "",
        task: "",
        description: "",
      });
      loadData();
    } catch (err) {
      alert("Error saving timesheet");
    } finally {
      setSaving(false);
    }
  };

  const totalHours = timesheets.reduce(
    (s, t) => s + parseFloat(t.hoursLogged || 0),
    0,
  );
  const approvedHours = timesheets
    .filter((t) => t.status === "APPROVED")
    .reduce((s, t) => s + parseFloat(t.hoursLogged || 0), 0);

  if (loading) return <div className="loading">Loading timesheets...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">My Timesheets</div>
          <div className="page-subtitle">
            {timesheets.length} entries · {totalHours.toFixed(1)}h total
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 18,
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
        ].map((c, i) => (
          <div
            key={i}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: c.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 4,
                opacity: 0.8,
              }}
            >
              {c.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">Log Timesheet Entry</div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-3">
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
                <label className="form-label">Hours *</label>
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
                  list="proj-list"
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                />
                <datalist id="proj-list">
                  <option value="CRM Portal" />
                  <option value="HR Portal" />
                  <option value="Mobile App" />
                  <option value="Internal Tools" />
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
              <div className="form-group" style={{ gridColumn: "span 2" }}>
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
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
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

      <div className="card">
        <div className="card-header">
          <div className="card-title">Timesheet History</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours</th>
                <th>Project</th>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>
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
                    <span
                      style={{
                        background: "#faf5ff",
                        color: "#5b21b6",
                        padding: "3px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {t.project || "—"}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>
                    {t.task || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>
                      ● {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {timesheets.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAssignment />
                      </div>
                      <div className="empty-title">No timesheets yet</div>
                      <div className="empty-sub">
                        Click "Log Time" to add one
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

const EmployeePortal = ({ user, onLogout }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div className="main-layout">
      <Topbar user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<EmployeeDashboard user={user} />} />
        <Route path="/attendance" element={<MyAttendance user={user} />} />
        <Route path="/leave" element={<Leave user={user} />} />
        <Route path="/timesheets" element={<MyTimesheets user={user} />} />
        <Route path="/announcements" element={<Announcements user={user} />} />
      </Routes>
    </div>
  </div>
);

export default EmployeePortal;
