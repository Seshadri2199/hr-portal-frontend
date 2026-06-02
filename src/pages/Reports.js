import React, { useState, useEffect } from "react";
import { employeeAPI, leaveAPI, timesheetAPI } from "../services/api";
import {
  MdBarChart,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdDownload,
} from "react-icons/md";

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("overview");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [empRes, leaveRes, tsRes] = await Promise.all([
        employeeAPI.getAll(),
        leaveAPI.getAll(),
        timesheetAPI.getPending(),
      ]);
      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
      setTimesheets(tsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data.length) {
      alert("No data to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => `"${row[h] || ""}"`).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadEmployeeReport = () => {
    downloadCSV(
      employees.map((e) => ({
        Code: e.employeeCode,
        "First Name": e.firstName,
        "Last Name": e.lastName,
        Email: e.email,
        Phone: e.phone || "",
        Department: e.department?.name || "",
        Designation: e.designation?.title || "",
        Type: e.employmentType,
        Status: e.status,
        Joined: e.dateOfJoining,
      })),
      "employee_report",
    );
  };

  const downloadLeaveReport = () => {
    downloadCSV(
      leaves.map((l) => ({
        Employee: `${l.employee?.firstName} ${l.employee?.lastName}`,
        Code: l.employee?.employeeCode || "",
        "Leave Type": l.leaveType?.name || "",
        From: l.fromDate,
        To: l.toDate,
        Days: l.totalDays,
        Status: l.status,
        Reason: l.reason || "",
      })),
      "leave_report",
    );
  };

  const downloadTimesheetReport = () => {
    downloadCSV(
      timesheets.map((t) => ({
        Employee: `${t.employee?.firstName} ${t.employee?.lastName}`,
        Date: t.workDate,
        Hours: t.hoursLogged,
        Project: t.project || "",
        Task: t.task || "",
        Status: t.status,
      })),
      "timesheet_report",
    );
  };

  const deptBreakdown = employees.reduce((acc, emp) => {
    const dept = emp.department?.name || "Unassigned";
    if (!acc[dept]) acc[dept] = 0;
    acc[dept]++;
    return acc;
  }, {});

  const leaveBreakdown = leaves.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const empTypeBreakdown = employees.reduce((acc, e) => {
    const type = e.employmentType?.replace("_", " ") || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const tabs = [
    { id: "overview", label: "Overview", icon: <MdBarChart size={15} /> },
    { id: "employees", label: "Employees", icon: <MdPeople size={15} /> },
    { id: "leave", label: "Leave", icon: <MdEventNote size={15} /> },
    { id: "timesheets", label: "Timesheets", icon: <MdAssignment size={15} /> },
  ];

  const BarChart = ({ data, color }) => {
    const max = Math.max(...Object.values(data), 1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.entries(data).map(([key, val]) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 120,
                fontSize: 12,
                fontWeight: 600,
                color: "#475569",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {key}
            </div>
            <div
              style={{
                flex: 1,
                background: "#f1f5f9",
                borderRadius: 6,
                height: 26,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(val / max) * 100}%`,
                  height: "100%",
                  background: color,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 8,
                  minWidth: val > 0 ? 36 : 0,
                  transition: "width 0.4s ease",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>
                  {val}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const StatCard = ({ label, value, color, bg, sub }) => (
    <div
      style={{
        background: bg,
        borderRadius: 12,
        padding: "18px 20px",
        border: `1px solid ${color}30`,
        flex: 1,
        minWidth: 130,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          color,
          lineHeight: 1,
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#94a3b8",
          fontWeight: 700,
          marginTop: 6,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );

  if (loading)
    return (
      <div className="loading">
        <MdBarChart size={28} />
        Loading reports...
      </div>
    );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-subtitle">HR data insights and exports</div>
        </div>
      </div>

      <div className="tab-bar" style={{ marginBottom: 22 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeReport === tab.id ? "active" : ""}`}
            onClick={() => setActiveReport(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeReport === "overview" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <StatCard
              label="Total Employees"
              value={employees.length}
              color="#334155"
              bg="#f1f5f9"
              sub={`${employees.filter((e) => e.status === "ACTIVE").length} active`}
            />
            <StatCard
              label="Total Leaves"
              value={leaves.length}
              color="#d97706"
              bg="#fffbeb"
              sub={`${leaveBreakdown["PENDING"] || 0} pending`}
            />
            <StatCard
              label="Timesheets"
              value={timesheets.length}
              color="#16a34a"
              bg="#f0fdf4"
              sub="This period"
            />
            <StatCard
              label="Departments"
              value={Object.keys(deptBreakdown).length}
              color="#7c3aed"
              bg="#faf5ff"
              sub="Active"
            />
          </div>

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
                <div className="card-title">Employees by Department</div>
              </div>
              <div className="card-body">
                <BarChart data={deptBreakdown} color="#334155" />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Employment Type</div>
              </div>
              <div className="card-body">
                <BarChart data={empTypeBreakdown} color="#16a34a" />
              </div>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
          >
            <div className="card">
              <div className="card-header">
                <div className="card-title">Leave Status</div>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    {
                      label: "Approved",
                      value: leaveBreakdown["APPROVED"] || 0,
                      color: "#16a34a",
                      bg: "#f0fdf4",
                    },
                    {
                      label: "Pending",
                      value: leaveBreakdown["PENDING"] || 0,
                      color: "#d97706",
                      bg: "#fffbeb",
                    },
                    {
                      label: "Rejected",
                      value: leaveBreakdown["REJECTED"] || 0,
                      color: "#dc2626",
                      bg: "#fef2f2",
                    },
                    {
                      label: "Cancelled",
                      value: leaveBreakdown["CANCELLED"] || 0,
                      color: "#94a3b8",
                      bg: "#f8fafc",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: item.bg,
                        borderRadius: 10,
                        padding: "14px 18px",
                        flex: 1,
                        textAlign: "center",
                        border: `1px solid ${item.color}25`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 900,
                          color: item.color,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.value}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Quick Export</div>
                <div className="card-subtitle">Download as CSV</div>
              </div>
              <div className="card-body">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    {
                      label: "Employee Report",
                      sub: `${employees.length} employees`,
                      color: "#334155",
                      bg: "#f1f5f9",
                      fn: downloadEmployeeReport,
                    },
                    {
                      label: "Leave Report",
                      sub: `${leaves.length} requests`,
                      color: "#d97706",
                      bg: "#fffbeb",
                      fn: downloadLeaveReport,
                    },
                    {
                      label: "Timesheet Report",
                      sub: `${timesheets.length} entries`,
                      color: "#16a34a",
                      bg: "#f0fdf4",
                      fn: downloadTimesheetReport,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: item.bg,
                        borderRadius: 10,
                        padding: "12px 16px",
                        border: `1px solid ${item.color}25`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginTop: 2,
                          }}
                        >
                          {item.sub}
                        </div>
                      </div>
                      <button
                        onClick={item.fn}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: item.color,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <MdDownload size={13} /> Export
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYEES */}
      {activeReport === "employees" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Employee Report</div>
              <div className="card-subtitle">{employees.length} employees</div>
            </div>
            <button
              onClick={downloadEmployeeReport}
              className="btn btn-primary"
            >
              <MdDownload size={15} /> Export CSV
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
                {employees.map((emp, i) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {emp.email}
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
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>
                      {emp.dateOfJoining}
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
      )}

      {/* LEAVE */}
      {activeReport === "leave" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <StatCard
              label="Total"
              value={leaves.length}
              color="#334155"
              bg="#f1f5f9"
            />
            <StatCard
              label="Approved"
              value={leaves.filter((l) => l.status === "APPROVED").length}
              color="#16a34a"
              bg="#f0fdf4"
            />
            <StatCard
              label="Pending"
              value={leaves.filter((l) => l.status === "PENDING").length}
              color="#d97706"
              bg="#fffbeb"
            />
            <StatCard
              label="Rejected"
              value={leaves.filter((l) => l.status === "REJECTED").length}
              color="#dc2626"
              bg="#fef2f2"
            />
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Leave Report</div>
              <button onClick={downloadLeaveReport} className="btn btn-primary">
                <MdDownload size={15} /> Export CSV
              </button>
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
                      <td>
                        <div style={{ fontWeight: 700 }}>
                          {l.employee?.firstName} {l.employee?.lastName}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {l.employee?.employeeCode}
                        </div>
                      </td>
                      <td>
                        <span className="code-pill">{l.leaveType?.name}</span>
                      </td>
                      <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                      <td style={{ fontSize: 12 }}>{l.toDate}</td>
                      <td style={{ fontWeight: 800 }}>{l.totalDays}</td>
                      <td>
                        <span
                          className={`badge badge-${l.status?.toLowerCase()}`}
                        >
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
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TIMESHEETS */}
      {activeReport === "timesheets" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <StatCard
              label="Total Entries"
              value={timesheets.length}
              color="#334155"
              bg="#f1f5f9"
            />
            <StatCard
              label="Total Hours"
              value={`${timesheets.reduce((s, t) => s + parseFloat(t.hoursLogged || 0), 0).toFixed(0)}h`}
              color="#16a34a"
              bg="#f0fdf4"
            />
            <StatCard
              label="Approved"
              value={timesheets.filter((t) => t.status === "APPROVED").length}
              color="#7c3aed"
              bg="#faf5ff"
            />
            <StatCard
              label="Pending"
              value={timesheets.filter((t) => t.status === "SUBMITTED").length}
              color="#d97706"
              bg="#fffbeb"
            />
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Timesheet Report</div>
              <button
                onClick={downloadTimesheetReport}
                className="btn btn-primary"
              >
                <MdDownload size={15} /> Export CSV
              </button>
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
                      <td style={{ fontWeight: 600 }}>{t.project || "—"}</td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {t.task || "—"}
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
                  {timesheets.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: 40,
                          color: "#94a3b8",
                        }}
                      >
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
