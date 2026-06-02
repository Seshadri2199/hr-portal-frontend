import React, { useState, useEffect } from "react";
import { dashboardAPI, employeeAPI } from "../services/api";
import {
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdTrendingUp,
} from "react-icons/md";

const avatarColors = [
  "avatar-blue",
  "avatar-green",
  "avatar-orange",
  "avatar-purple",
  "avatar-red",
  "avatar-teal",
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
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

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  if (loading)
    return (
      <div className="loading">
        <MdTrendingUp size={28} />
        Loading dashboard...
      </div>
    );

  const metrics = [
    {
      label: "Total Employees",
      value: stats?.totalActiveEmployees || 0,
      icon: <MdPeople size={24} />,
      color: "slate",
      change: "Active staff",
    },
    {
      label: "Present Today",
      value: stats?.presentToday || 0,
      icon: <MdAccessTime size={24} />,
      color: "green",
      change: "Checked in today",
    },
    {
      label: "Pending Leave",
      value: stats?.pendingLeaveApprovals || 0,
      icon: <MdEventNote size={24} />,
      color: "orange",
      change: "Awaiting approval",
    },
    {
      label: "Pending Timesheets",
      value: stats?.pendingTimesheets || 0,
      icon: <MdAssignment size={24} />,
      color: "red",
      change: "Need review",
    },
  ];

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
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

      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <div className="metric-card" key={i}>
            <div className={`metric-icon ${m.color}`}>{m.icon}</div>
            <div className="metric-info">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-change">{m.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Active Employees</div>
            <div className="card-subtitle">
              Showing {employees.length} employees
            </div>
          </div>
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
              {employees.map((emp, i) => (
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
                  <td style={{ fontWeight: 600 }}>
                    {emp.department?.name || "—"}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {emp.designation?.title || "—"}
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
