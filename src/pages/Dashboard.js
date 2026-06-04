import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, employeeAPI, leaveAPI } from "../services/api";
import {
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdTrendingUp,
  MdArrowForward,
} from "react-icons/md";

const avatarColors = [
  { bg: "#eff6ff", text: "#1e40af" },
  { bg: "#f0fdf4", text: "#166534" },
  { bg: "#fffbeb", text: "#92400e" },
  { bg: "#faf5ff", text: "#5b21b6" },
  { bg: "#fef2f2", text: "#991b1b" },
  { bg: "#f0fdfa", text: "#197e78" },
];

const MetricCard = ({ label, value, sub, subColor, icon, accentColor }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 200ms",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")
    }
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: accentColor,
        borderRadius: "14px 0 0 14px",
      }}
    />
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        flexShrink: 0,
        background: `${accentColor}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: accentColor,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
          letterSpacing: "-0.8px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: subColor || "#16a34a",
          fontWeight: 600,
          marginTop: 4,
        }}
      >
        {sub}
      </div>
    </div>
  </div>
);

const BarChart = ({ data, color }) => {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Object.entries(data).map(([key, val]) => (
        <div key={key}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              {key}
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
              {val}
            </span>
          </div>
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: 6,
              height: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(val / max) * 100}%`,
                height: "100%",
                background: color,
                borderRadius: 6,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ approved, pending, rejected, total }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const approvedPct = total > 0 ? (approved / total) * circ : 0;
  const pendingPct = total > 0 ? (pending / total) * circ : 0;
  const rejectedPct = total > 0 ? (rejected / total) * circ : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        justifyContent: "center",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="18"
        />
        {total === 0 ? null : (
          <>
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="#16a34a"
              strokeWidth="18"
              strokeDasharray={`${approvedPct} ${circ}`}
              strokeDashoffset={circ / 4}
              strokeLinecap="round"
            />
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="#d97706"
              strokeWidth="18"
              strokeDasharray={`${pendingPct} ${circ}`}
              strokeDashoffset={circ / 4 - approvedPct}
              strokeLinecap="round"
            />
            <circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="#dc2626"
              strokeWidth="18"
              strokeDasharray={`${rejectedPct} ${circ}`}
              strokeDashoffset={circ / 4 - approvedPct - pendingPct}
              strokeLinecap="round"
            />
          </>
        )}
        <text
          x="70"
          y="65"
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill="#0f172a"
        >
          {total}
        </text>
        <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8">
          total
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            label: "Approved",
            value: approved,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          { label: "Pending", value: pending, color: "#d97706", bg: "#fffbeb" },
          {
            label: "Rejected",
            value: rejected,
            color: "#dc2626",
            bg: "#fef2f2",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: item.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "#475569",
                fontWeight: 600,
                minWidth: 65,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                background: item.bg,
                color: item.color,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [dashRes, empRes, leaveRes] = await Promise.all([
        dashboardAPI.get(),
        employeeAPI.getAll(),
        leaveAPI.getAll(),
      ]);
      setStats(dashRes.data);
      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  if (loading)
    return (
      <div className="loading">
        <MdTrendingUp size={28} />
        Loading dashboard...
      </div>
    );

  // Analytics
  const deptBreakdown = employees.reduce((acc, emp) => {
    const dept = emp.departmentName || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = employees.reduce((acc, emp) => {
    const type = emp.employmentType?.replace("_", " ") || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED").length;
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;
  const rejectedLeaves = leaves.filter((l) => l.status === "REJECTED").length;

  const metrics = [
    {
      label: "Total Employees",
      value: employees.length,
      sub: `${employees.filter((e) => e.status === "ACTIVE").length} active`,
      icon: <MdPeople size={22} />,
      accentColor: "#3b82f6",
      subColor: "#3b82f6",
    },
    {
      label: "Present Today",
      value: stats?.presentToday || 0,
      sub: "Checked in today",
      icon: <MdAccessTime size={22} />,
      accentColor: "#16a34a",
      subColor: "#16a34a",
    },
    {
      label: "Pending Leave",
      value: stats?.pendingLeaveApprovals || 0,
      sub: "Awaiting approval",
      icon: <MdEventNote size={22} />,
      accentColor: "#d97706",
      subColor: "#d97706",
    },
    {
      label: "Pending Timesheets",
      value: stats?.pendingTimesheets || 0,
      sub: "Need review",
      icon: <MdAssignment size={22} />,
      accentColor: "#dc2626",
      subColor: "#dc2626",
    },
  ];

  return (
    <div className="content">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 22 }}>
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">
            {greeting()}, {user?.fullName?.split(" ")[0] || "Admin"}! ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#16a34a",
              display: "inline-block",
            }}
          />
          System Online
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginBottom: 18,
        }}
      >
        {/* Department Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Employees by Department</div>
              <div className="card-subtitle">
                {employees.length} total across{" "}
                {Object.keys(deptBreakdown).length} departments
              </div>
            </div>
          </div>
          <div className="card-body">
            {Object.keys(deptBreakdown).length > 0 ? (
              <BarChart data={deptBreakdown} color="#3b82f6" />
            ) : (
              <div className="empty-state" style={{ padding: 20 }}>
                <div className="empty-title">No department data</div>
              </div>
            )}
          </div>
        </div>

        {/* Leave Overview Donut */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Leave Overview</div>
              <div className="card-subtitle">
                {leaves.length} total requests
              </div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart
              approved={approvedLeaves}
              pending={pendingLeaves}
              rejected={rejectedLeaves}
              total={leaves.length}
            />
          </div>
        </div>
      </div>

      {/* Employment Type + Quick Stats */}
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
            <div className="card-title">Employment Type</div>
          </div>
          <div className="card-body">
            <BarChart data={typeBreakdown} color="#16a34a" />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Quick Stats</div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  label: "Attendance Rate Today",
                  value:
                    employees.length > 0
                      ? `${Math.round(((stats?.presentToday || 0) / employees.length) * 100)}%`
                      : "0%",
                  color: "#16a34a",
                  bg: "#f0fdf4",
                },
                {
                  label: "Leave Approval Rate",
                  value:
                    leaves.length > 0
                      ? `${Math.round((approvedLeaves / leaves.length) * 100)}%`
                      : "N/A",
                  color: "#3b82f6",
                  bg: "#eff6ff",
                },
                {
                  label: "Active Employees",
                  value: `${employees.filter((e) => e.status === "ACTIVE").length} / ${employees.length}`,
                  color: "#7c3aed",
                  bg: "#faf5ff",
                },
                {
                  label: "Departments with Staff",
                  value: `${Object.values(deptBreakdown).filter((v) => v > 0).length} / 6`,
                  color: "#d97706",
                  bg: "#fffbeb",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: item.bg,
                    border: `1px solid ${item.color}22`,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{ fontSize: 16, fontWeight: 800, color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Employees Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Employees</div>
            <div className="card-subtitle">
              Showing {Math.min(employees.length, 5)} of {employees.length}
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/employees")}
            style={{
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            View All <MdArrowForward size={14} />
          </button>
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
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp, i) => (
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
                        <div
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginTop: 1,
                          }}
                        >
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="code-pill">{emp.employeeCode}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "#334155" }}>
                    {emp.departmentName || "—"}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {emp.designationTitle || "—"}
                  </td>
                  <td>
                    <span
                      className={`badge badge-${emp.employmentType?.toLowerCase()}`}
                    >
                      {emp.employmentType?.replace("_", " ") || "—"}
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: 12 }}>
                    {emp.dateOfJoining}
                  </td>
                  <td>
                    <span className="badge badge-active">● Active</span>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdPeople />
                      </div>
                      <div className="empty-title">No employees yet</div>
                      <div className="empty-sub">
                        Go to Staff tab to add employees
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

export default Dashboard;
