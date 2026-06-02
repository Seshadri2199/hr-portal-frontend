import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { attendanceAPI, leaveAPI, timesheetAPI } from "../services/api";
import Announcements from "../pages/Announcements";
import {
  MdDashboard,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdAdd,
  MdClose,
  MdCampaign,
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
          data-tooltip={item.label}
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
            Employee Portal
          </div>
        </div>
      </div>

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
          EMPLOYEE
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
            {user.fullName || "Employee"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            {user.employeeCode || "Employee"}
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

const AttendanceCard = ({ user, todayAtt, loadData }) => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [liveTime, setLiveTime] = useState(0);

  useEffect(() => {
    if (todayAtt?.checkIn && !todayAtt?.checkOut) {
      const checkInTime = new Date(todayAtt.checkIn).getTime();
      const update = () => {
        const elapsed = Math.floor((Date.now() - checkInTime) / 1000);
        setLiveTime(elapsed);
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    } else if (todayAtt?.workingMinutes) {
      setLiveTime(todayAtt.workingMinutes * 60);
    } else {
      setLiveTime(0);
    }
  }, [todayAtt]);

  const formatLiveTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceAPI.checkIn(user.employeeId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error checking in");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAtt) {
      alert("Please check in first!");
      return;
    }
    setCheckingOut(true);
    try {
      await attendanceAPI.checkOut(user.employeeId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error checking out");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const isWorking = todayAtt?.checkIn && !todayAtt?.checkOut;

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 20,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Status + Live Timer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span
          style={{
            background: !todayAtt
              ? "rgba(255,255,255,0.06)"
              : isWorking
                ? "rgba(59,130,246,0.12)"
                : "rgba(245,158,11,0.12)",
            color: !todayAtt ? "#94a3b8" : isWorking ? "#3b82f6" : "#f59e0b",
            padding: "5px 14px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            border: `1px solid ${
              !todayAtt
                ? "rgba(255,255,255,0.08)"
                : isWorking
                  ? "rgba(59,130,246,0.2)"
                  : "rgba(245,158,11,0.2)"
            }`,
          }}
        >
          {!todayAtt
            ? "● Not Checked In"
            : isWorking
              ? "● Currently Working"
              : "● Checked Out"}
        </span>

        {/* Live Timer */}
        {liveTime > 0 && (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
              color: isWorking ? "#22c55e" : "#f59e0b",
              letterSpacing: "2px",
              background: isWorking
                ? "rgba(34,197,94,0.08)"
                : "rgba(245,158,11,0.08)",
              padding: "6px 16px",
              borderRadius: 10,
              border: `1px solid ${
                isWorking ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)"
              }`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isWorking && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            )}
            {formatLiveTime(liveTime)}
          </div>
        )}
      </div>

      {/* Time boxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "rgba(34,197,94,0.08)",
            borderRadius: 12,
            padding: "14px 18px",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
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
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 800,
              color: todayAtt?.checkIn ? "#22c55e" : "#475569",
              letterSpacing: "-0.5px",
            }}
          >
            {formatTime(todayAtt?.checkIn)}
          </div>
        </div>

        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            borderRadius: 12,
            padding: "14px 18px",
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
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
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 800,
              color: todayAtt?.checkOut ? "#f59e0b" : "#475569",
              letterSpacing: "-0.5px",
            }}
          >
            {formatTime(todayAtt?.checkOut)}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleCheckIn}
          disabled={checkingIn}
          style={{
            flex: 1,
            padding: "13px 20px",
            borderRadius: 11,
            border: "none",
            background: "#16a34a",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: checkingIn ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 150ms",
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            opacity: checkingIn ? 0.7 : 1,
          }}
        >
          {checkingIn ? "⏳ Checking in..." : "→ Check In"}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={checkingOut || !todayAtt}
          style={{
            flex: 1,
            padding: "13px 20px",
            borderRadius: 11,
            border: "none",
            background: !todayAtt ? "rgba(255,255,255,0.06)" : "#d97706",
            color: !todayAtt ? "#475569" : "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: !todayAtt || checkingOut ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 150ms",
            boxShadow: !todayAtt ? "none" : "0 4px 12px rgba(217,119,6,0.3)",
            opacity: checkingOut ? 0.7 : 1,
            outline: !todayAtt ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          {checkingOut ? "⏳ Checking out..." : "← Check Out"}
        </button>
      </div>
    </div>
  );
};

const EmployeeDashboard = ({ user }) => {
  const [todayAtt, setTodayAtt] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [mySheets, setMySheets] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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
        import("../services/api").then((m) => m.announcementAPI.getActive()),
      ]);
      setTodayAtt(attRes.data);
      setMyLeaves(leaveRes.data);
      setMySheets(tsRes.data);
      setAnnouncements(annRes.data?.slice(0, 3) || []);

      const types = typesRes.data;
      const leaves = leaveRes.data;
      const balances = types.map((type) => {
        const used = leaves.filter(
          (l) => l.leaveType?.id === type.id && l.status === "APPROVED",
        ).length;
        const total = type.maxDays || 12;
        return {
          name: type.name,
          used,
          total,
          remaining: Math.max(total - used, 0),
          color:
            used >= total
              ? "#dc2626"
              : used >= total * 0.7
                ? "#d97706"
                : "#16a34a",
        };
      });
      setLeaveBalances(balances);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingLeaves = myLeaves.filter((l) => l.status === "PENDING").length;
  const approvedLeaves = myLeaves.filter((l) => l.status === "APPROVED").length;

  const priorityConfig = {
    LOW: { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" },
    NORMAL: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    HIGH: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    URGENT: { color: "#dc2626", bg: "#fef2f2", border: "#fecdd3" },
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">My Dashboard</div>
          <div className="page-subtitle">Welcome back, {user.fullName}!</div>
        </div>
        <div
          style={{
            background: "#f1f5f9",
            padding: "7px 14px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
            fontWeight: 600,
            color: "#334155",
          }}
        >
          Code: <strong>{user.employeeCode}</strong>
        </div>
      </div>

      {/* Attendance Card with Live Timer */}
      <AttendanceCard user={user} todayAtt={todayAtt} loadData={loadData} />

      {/* Leave Balance Cards */}
      {leaveBalances.length > 0 && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">Leave Balance</div>
            <div className="card-subtitle">Remaining days per leave type</div>
          </div>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 14,
              }}
            >
              {leaveBalances.map((lb, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: "16px",
                    border: "1px solid #f1f5f9",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 32,
                      fontWeight: 900,
                      color: lb.color,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {lb.remaining}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: 4,
                    }}
                  >
                    {lb.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {lb.used} used of {lb.total}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 4,
                      background: "#e2e8f0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min((lb.used / lb.total) * 100, 100)}%`,
                        height: "100%",
                        background: lb.color,
                        borderRadius: 4,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Announcements Preview */}
      {announcements.length > 0 && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">📢 Latest Announcements</div>
            <div className="card-subtitle">{announcements.length} new</div>
          </div>
          <div className="card-body" style={{ padding: "12px 20px" }}>
            {announcements.map((ann) => {
              const p = priorityConfig[ann.priority] || priorityConfig.NORMAL;
              return (
                <div
                  key={ann.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: p.color,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div>
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
                        lineHeight: 1.6,
                      }}
                    >
                      {ann.content.length > 100
                        ? ann.content.substring(0, 100) + "..."
                        : ann.content}
                    </div>
                  </div>
                  <span
                    style={{
                      background: p.bg,
                      color: p.color,
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontSize: 9,
                      fontWeight: 700,
                      flexShrink: 0,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {ann.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        className="metrics-grid"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        <div className="metric-card">
          <div className="metric-icon slate">
            <MdEventNote size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Leaves</div>
            <div className="metric-value">{myLeaves.length}</div>
            <div className="metric-change">{approvedLeaves} approved</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon orange">
            <MdEventNote size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Pending Leaves</div>
            <div className="metric-value">{pendingLeaves}</div>
            <div className="metric-change" style={{ color: "#d97706" }}>
              Awaiting approval
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon green">
            <MdAssignment size={24} />
          </div>
          <div className="metric-info">
            <div className="metric-label">Timesheets</div>
            <div className="metric-value">{mySheets.length}</div>
            <div className="metric-change">Total logged</div>
          </div>
        </div>
      </div>

      {/* Recent Leaves */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div className="card-title">My Leave Requests</div>
          <div className="card-subtitle">{myLeaves.length} total</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.slice(0, 5).map((l) => (
                <tr key={l.id}>
                  <td>
                    <span className="code-pill">{l.leaveType?.name}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                  <td style={{ fontSize: 12 }}>{l.toDate}</td>
                  <td style={{ fontWeight: 700 }}>{l.totalDays}</td>
                  <td style={{ color: "var(--gray-500)", fontSize: 12 }}>
                    {l.reason || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${l.status?.toLowerCase()}`}>
                      ● {l.status}
                    </span>
                  </td>
                </tr>
              ))}
              {myLeaves.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdEventNote />
                      </div>
                      <div className="empty-title">No leave requests</div>
                      <div className="empty-sub">Go to Leave tab to apply</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Timesheets */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">My Timesheets</div>
          <div className="card-subtitle">Recent entries</div>
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
              {mySheets.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td style={{ fontSize: 12 }}>{t.workDate}</td>
                  <td>
                    <span className="code-pill">{t.hoursLogged}h</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.project || "—"}</td>
                  <td style={{ color: "var(--gray-500)", fontSize: 12 }}>
                    {t.task || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>
                      ● {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {mySheets.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAssignment />
                      </div>
                      <div className="empty-title">No timesheets yet</div>
                      <div className="empty-sub">
                        Go to Sheet tab to log time
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

const MyAttendance = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [todayAtt, setTodayAtt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const getDuration = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

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

      <AttendanceCard user={user} todayAtt={todayAtt} loadData={loadData} />

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
                  <td style={{ color: "#16a34a", fontWeight: 700 }}>
                    {formatTime(a.checkIn)}
                  </td>
                  <td style={{ color: "#d97706", fontWeight: 700 }}>
                    {a.checkOut ? (
                      formatTime(a.checkOut)
                    ) : (
                      <span style={{ color: "#94a3b8", fontWeight: 500 }}>
                        In progress
                      </span>
                    )}
                  </td>
                  <td>
                    {getDuration(a.workingMinutes) ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#334155",
                          background: "#f1f5f9",
                          padding: "2px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      >
                        {getDuration(a.workingMinutes)}
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

const MyLeave = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    totalDays: 1,
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leaveRes, typesRes] = await Promise.all([
        leaveAPI.getByEmployee(user.employeeId),
        leaveAPI.getTypes(),
      ]);
      setLeaves(leaveRes.data);
      setLeaveTypes(typesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.leaveTypeId || !form.fromDate || !form.toDate) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await leaveAPI.apply({
        employee: { id: user.employeeId },
        leaveType: { id: form.leaveTypeId },
        fromDate: form.fromDate,
        toDate: form.toDate,
        totalDays: form.totalDays,
        reason: form.reason,
      });
      setShowForm(false);
      setForm({
        leaveTypeId: "",
        fromDate: "",
        toDate: "",
        totalDays: 1,
        reason: "",
      });
      loadData();
    } catch (err) {
      alert("Error applying leave");
    }
  };

  const handleCancel = async (id) => {
    try {
      await leaveAPI.cancel(id);
      loadData();
    } catch (err) {
      alert("Error cancelling");
    }
  };

  if (loading) return <div className="loading">Loading leaves...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">My Leave</div>
          <div className="page-subtitle">{leaves.length} total requests</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">New Leave Application</div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-3">
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
                <label className="form-label">From Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.fromDate}
                  onChange={(e) =>
                    setForm({ ...form, fromDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">To Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.toDate}
                  onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Days</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={form.totalDays}
                  onChange={(e) =>
                    setForm({ ...form, totalDays: e.target.value })
                  }
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
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
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Application
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
          <div className="card-title">Leave History</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>
                    <span className="code-pill">{l.leaveType?.name}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                  <td style={{ fontSize: 12 }}>{l.toDate}</td>
                  <td style={{ fontWeight: 700 }}>{l.totalDays}</td>
                  <td style={{ color: "var(--gray-500)", fontSize: 12 }}>
                    {l.reason || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${l.status?.toLowerCase()}`}>
                      ● {l.status}
                    </span>
                  </td>
                  <td>
                    {l.status === "PENDING" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(l.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdEventNote />
                      </div>
                      <div className="empty-title">No leave requests yet</div>
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

const MyTimesheets = ({ user }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    workDate: "",
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
    try {
      await timesheetAPI.create({
        employee: { id: user.employeeId },
        workDate: form.workDate,
        hoursLogged: form.hoursLogged,
        project: form.project,
        task: form.task,
        description: form.description,
        status: "SUBMITTED",
      });
      setShowForm(false);
      setForm({
        workDate: "",
        hoursLogged: "",
        project: "",
        task: "",
        description: "",
      });
      loadData();
    } catch (err) {
      alert("Error saving timesheet");
    }
  };

  if (loading) return <div className="loading">Loading timesheets...</div>;

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">My Timesheets</div>
          <div className="page-subtitle">{timesheets.length} total entries</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Log Time"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">Log Timesheet</div>
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
                <label className="form-label">Hours Logged *</label>
                <input
                  type="number"
                  step="0.5"
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
                  value={form.project}
                  onChange={(e) =>
                    setForm({ ...form, project: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Task</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task"
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
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit Timesheet
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
                  <td style={{ fontWeight: 600 }}>{t.workDate}</td>
                  <td>
                    <span className="code-pill">{t.hoursLogged}h</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.project || "—"}</td>
                  <td style={{ color: "var(--gray-500)", fontSize: 12 }}>
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
        <Route path="/leave" element={<MyLeave user={user} />} />
        <Route path="/timesheets" element={<MyTimesheets user={user} />} />
        <Route path="/announcements" element={<Announcements user={user} />} />
      </Routes>
    </div>
  </div>
);

export default EmployeePortal;
