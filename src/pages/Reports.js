import React, { useState, useEffect } from "react";
import {
  employeeAPI,
  leaveAPI,
  timesheetAPI,
  attendanceAPI,
} from "../services/api";
import {
  MdBarChart,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdDownload,
  MdAccessTime,
  MdFilterList,
} from "react-icons/md";

const statusColors = {
  ACTIVE: { bg: "#f0fdf4", color: "#166534" },
  INACTIVE: { bg: "#fef2f2", color: "#991b1b" },
  APPROVED: { bg: "#f0fdf4", color: "#166534" },
  PENDING: { bg: "#fffbeb", color: "#92400e" },
  REJECTED: { bg: "#fef2f2", color: "#991b1b" },
  SUBMITTED: { bg: "#eff6ff", color: "#1e40af" },
  PRESENT: { bg: "#f0fdf4", color: "#166534" },
  ABSENT: { bg: "#fef2f2", color: "#991b1b" },
};

const MiniBar = ({ value, max, color }) => (
  <div
    style={{
      flex: 1,
      background: "#f1f5f9",
      borderRadius: 4,
      height: 8,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${max > 0 ? (value / max) * 100 : 0}%`,
        height: "100%",
        background: color,
        borderRadius: 4,
        transition: "width 0.5s ease",
      }}
    />
  </div>
);

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("overview");
  const [empFilter, setEmpFilter] = useState("ALL");
  const [leaveFilter, setLeaveFilter] = useState("ALL");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [empRes, leaveRes, tsRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        leaveAPI.getAll(),
        timesheetAPI.getPending(),
        attendanceAPI.getByDate(today),
      ]);
      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
      setTimesheets(tsRes.data);
      setAttendance(attRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data, filename, columns) => {
    if (!data.length) {
      alert("No data to export");
      return;
    }
    const headers = columns.map((c) => c.label);
    const rows = data.map((row) =>
      columns.map((c) => `"${c.value(row) || ""}"`).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportEmployees = () =>
    downloadCSV(employees, "employee_report", [
      { label: "Code", value: (e) => e.employeeCode },
      { label: "First Name", value: (e) => e.firstName },
      { label: "Last Name", value: (e) => e.lastName },
      { label: "Email", value: (e) => e.email },
      { label: "Phone", value: (e) => e.phone },
      { label: "Department", value: (e) => e.departmentName },
      { label: "Designation", value: (e) => e.designationTitle },
      { label: "Type", value: (e) => e.employmentType },
      { label: "Status", value: (e) => e.status },
      { label: "Joined", value: (e) => e.dateOfJoining },
    ]);

  const exportLeaves = () =>
    downloadCSV(leaves, "leave_report", [
      {
        label: "Employee",
        value: (l) => `${l.employee?.firstName} ${l.employee?.lastName}`,
      },
      { label: "Code", value: (l) => l.employee?.employeeCode },
      { label: "Leave Type", value: (l) => l.leaveType?.name },
      { label: "From", value: (l) => l.fromDate },
      { label: "To", value: (l) => l.toDate },
      { label: "Days", value: (l) => l.totalDays },
      { label: "Reason", value: (l) => l.reason },
      { label: "Status", value: (l) => l.status },
    ]);

  const exportTimesheets = () =>
    downloadCSV(timesheets, "timesheet_report", [
      {
        label: "Employee",
        value: (t) => `${t.employee?.firstName} ${t.employee?.lastName}`,
      },
      { label: "Code", value: (t) => t.employee?.employeeCode },
      { label: "Date", value: (t) => t.workDate },
      { label: "Hours", value: (t) => t.hoursLogged },
      { label: "Project", value: (t) => t.project },
      { label: "Task", value: (t) => t.task },
      { label: "Status", value: (t) => t.status },
    ]);

  const exportAttendance = () =>
    downloadCSV(attendance, "attendance_report", [
      {
        label: "Employee",
        value: (a) => `${a.employee?.firstName} ${a.employee?.lastName}`,
      },
      { label: "Code", value: (a) => a.employee?.employeeCode },
      { label: "Date", value: (a) => a.attendanceDate },
      {
        label: "Check In",
        value: (a) =>
          a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : "",
      },
      {
        label: "Check Out",
        value: (a) =>
          a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "",
      },
      {
        label: "Hours",
        value: (a) =>
          a.workingMinutes
            ? `${Math.floor(a.workingMinutes / 60)}h ${a.workingMinutes % 60}m`
            : "",
      },
      { label: "Status", value: (a) => a.status },
    ]);

  // Analytics
  const deptBreakdown = employees.reduce((acc, e) => {
    const d = e.departmentName || "Unassigned";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const leaveByType = leaves.reduce((acc, l) => {
    const t = l.leaveType?.name || "Unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const leaveByStatus = leaves.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const projectHours = timesheets.reduce((acc, t) => {
    const p = t.project || "General";
    acc[p] = (acc[p] || 0) + parseFloat(t.hoursLogged || 0);
    return acc;
  }, {});

  const maxDept = Math.max(...Object.values(deptBreakdown), 1);
  const maxProject = Math.max(...Object.values(projectHours), 1);

  const filteredEmployees =
    empFilter === "ALL"
      ? employees
      : employees.filter(
          (e) => e.status === empFilter || e.employmentType === empFilter,
        );

  const filteredLeaves =
    leaveFilter === "ALL"
      ? leaves
      : leaves.filter((l) => l.status === leaveFilter);

  const tabs = [
    { id: "overview", label: "Overview", icon: <MdBarChart size={15} /> },
    { id: "employees", label: "Employees", icon: <MdPeople size={15} /> },
    { id: "leave", label: "Leave", icon: <MdEventNote size={15} /> },
    { id: "timesheets", label: "Timesheets", icon: <MdAssignment size={15} /> },
    { id: "attendance", label: "Attendance", icon: <MdAccessTime size={15} /> },
  ];

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();
  const avatarColors = [
    { bg: "#eff6ff", text: "#1e40af" },
    { bg: "#f0fdf4", text: "#166534" },
    { bg: "#fffbeb", text: "#92400e" },
    { bg: "#faf5ff", text: "#5b21b6" },
    { bg: "#fef2f2", text: "#991b1b" },
  ];

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
          <div className="page-subtitle">HR data insights and CSV exports</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-outline"
            onClick={exportEmployees}
            style={{ fontSize: 12 }}
          >
            <MdDownload size={14} /> Employees CSV
          </button>
          <button
            className="btn btn-outline"
            onClick={exportLeaves}
            style={{ fontSize: 12 }}
          >
            <MdDownload size={14} /> Leave CSV
          </button>
          <button
            className="btn btn-outline"
            onClick={exportTimesheets}
            style={{ fontSize: 12 }}
          >
            <MdDownload size={14} /> Timesheets CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 22,
          background: "#f1f5f9",
          padding: 4,
          borderRadius: 12,
          width: "fit-content",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              background: activeReport === tab.id ? "#fff" : "transparent",
              color: activeReport === tab.id ? "#0f172a" : "#64748b",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 150ms",
              boxShadow:
                activeReport === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeReport === "overview" && (
        <>
          {/* KPI Cards */}
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
                value: employees.length,
                sub: `${employees.filter((e) => e.status === "ACTIVE").length} active`,
                color: "#3b82f6",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                label: "Leave Requests",
                value: leaves.length,
                sub: `${leaveByStatus["PENDING"] || 0} pending`,
                color: "#d97706",
                bg: "#fffbeb",
                border: "#fde68a",
              },
              {
                label: "Timesheet Hours",
                value: `${timesheets.reduce((s, t) => s + parseFloat(t.hoursLogged || 0), 0).toFixed(0)}h`,
                sub: `${timesheets.length} entries`,
                color: "#7c3aed",
                bg: "#faf5ff",
                border: "#ddd6fe",
              },
              {
                label: "Present Today",
                value: attendance.length,
                sub: `${employees.length} total employees`,
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
                    fontSize: 28,
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Dept breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Headcount by Department</div>
                <div className="card-subtitle">
                  {Object.keys(deptBreakdown).length} departments
                </div>
              </div>
              <div className="card-body">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {Object.entries(deptBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dept, count]) => (
                      <div key={dept}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
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
                            {dept}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#0f172a",
                            }}
                          >
                            {count}
                          </span>
                        </div>
                        <MiniBar value={count} max={maxDept} color="#3b82f6" />
                      </div>
                    ))}
                  {Object.keys(deptBreakdown).length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: 20,
                      }}
                    >
                      No data
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project hours */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Hours by Project</div>
                <div className="card-subtitle">
                  {Object.keys(projectHours).length} projects
                </div>
              </div>
              <div className="card-body">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {Object.entries(projectHours)
                    .sort((a, b) => b[1] - a[1])
                    .map(([project, hours]) => (
                      <div key={project}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
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
                            {project}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#7c3aed",
                            }}
                          >
                            {hours.toFixed(1)}h
                          </span>
                        </div>
                        <MiniBar
                          value={hours}
                          max={maxProject}
                          color="#7c3aed"
                        />
                      </div>
                    ))}
                  {Object.keys(projectHours).length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: 20,
                      }}
                    >
                      No timesheet data
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Leave status + Employment type */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
          >
            <div className="card">
              <div className="card-header">
                <div className="card-title">Leave by Status</div>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    {
                      status: "APPROVED",
                      label: "Approved",
                      color: "#16a34a",
                      bg: "#f0fdf4",
                    },
                    {
                      status: "PENDING",
                      label: "Pending",
                      color: "#d97706",
                      bg: "#fffbeb",
                    },
                    {
                      status: "REJECTED",
                      label: "Rejected",
                      color: "#dc2626",
                      bg: "#fef2f2",
                    },
                    {
                      status: "CANCELLED",
                      label: "Cancelled",
                      color: "#64748b",
                      bg: "#f1f5f9",
                    },
                  ].map((item) => (
                    <div
                      key={item.status}
                      style={{
                        flex: 1,
                        background: item.bg,
                        borderRadius: 12,
                        padding: "16px 18px",
                        textAlign: "center",
                        border: `1px solid ${item.color}22`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: item.color,
                        }}
                      >
                        {leaveByStatus[item.status] || 0}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: item.color,
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
                <div className="card-title">Employment Type</div>
              </div>
              <div className="card-body">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {["FULL_TIME", "PART_TIME", "CONTRACT", "TEMP"].map(
                    (type) => {
                      const count = employees.filter(
                        (e) => e.employmentType === type,
                      ).length;
                      return (
                        <div
                          key={type}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#475569",
                              width: 100,
                              flexShrink: 0,
                            }}
                          >
                            {type.replace("_", " ")}
                          </span>
                          <MiniBar
                            value={count}
                            max={employees.length || 1}
                            color="#16a34a"
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#0f172a",
                              flexShrink: 0,
                              minWidth: 20,
                            }}
                          >
                            {count}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EMPLOYEES REPORT */}
      {activeReport === "employees" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Employee Report</div>
              <div className="card-subtitle">
                {filteredEmployees.length} employees
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                className="form-control"
                style={{ width: 160 }}
                value={empFilter}
                onChange={(e) => setEmpFilter(e.target.value)}
              >
                <option value="ALL">All Employees</option>
                <option value="ACTIVE">Active Only</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="CONTRACT">Contract</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={exportEmployees}
                style={{ fontSize: 12 }}
              >
                <MdDownload size={14} /> Export CSV
              </button>
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
                {filteredEmployees.map((emp, i) => {
                  const sc = statusColors[emp.status] || statusColors.ACTIVE;
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              flexShrink: 0,
                              background:
                                avatarColors[i % avatarColors.length].bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
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
                      <td style={{ color: "#94a3b8", fontSize: 12 }}>
                        {emp.dateOfJoining}
                      </td>
                      <td>
                        <span
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ● {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEAVE REPORT */}
      {activeReport === "leave" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Leave Report</div>
              <div className="card-subtitle">
                {filteredLeaves.length} requests
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                className="form-control"
                style={{ width: 160 }}
                value={leaveFilter}
                onChange={(e) => setLeaveFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={exportLeaves}
                style={{ fontSize: 12 }}
              >
                <MdDownload size={14} /> Export CSV
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((l, i) => {
                  const sc = statusColors[l.status] || statusColors.PENDING;
                  return (
                    <tr key={l.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              flexShrink: 0,
                              background:
                                avatarColors[i % avatarColors.length].bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              color: avatarColors[i % avatarColors.length].text,
                            }}
                          >
                            {getInitials(
                              l.employee?.firstName,
                              l.employee?.lastName,
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>
                              {l.employee?.firstName} {l.employee?.lastName}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                              {l.employee?.employeeCode}
                            </div>
                          </div>
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
                      <td style={{ fontSize: 12, fontWeight: 600 }}>
                        {l.fromDate}
                      </td>
                      <td style={{ fontSize: 12, fontWeight: 600 }}>
                        {l.toDate}
                      </td>
                      <td>
                        <span
                          style={{
                            background: "#f1f5f9",
                            color: "#0f172a",
                            padding: "3px 10px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {l.totalDays}d
                        </span>
                      </td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {l.reason || "—"}
                      </td>
                      <td>
                        <span
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ● {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredLeaves.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <div className="empty-icon">
                          <MdEventNote />
                        </div>
                        <div className="empty-title">No leave data</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TIMESHEETS REPORT */}
      {activeReport === "timesheets" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Timesheet Report</div>
              <div className="card-subtitle">
                {timesheets.length} entries ·{" "}
                {timesheets
                  .reduce((s, t) => s + parseFloat(t.hoursLogged || 0), 0)
                  .toFixed(1)}{" "}
                total hours
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={exportTimesheets}
              style={{ fontSize: 12 }}
            >
              <MdDownload size={14} /> Export CSV
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
                {timesheets.map((t, i) => {
                  const sc = statusColors[t.status] || {
                    bg: "#eff6ff",
                    color: "#1e40af",
                  };
                  return (
                    <tr key={t.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              flexShrink: 0,
                              background:
                                avatarColors[i % avatarColors.length].bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              color: avatarColors[i % avatarColors.length].text,
                            }}
                          >
                            {getInitials(
                              t.employee?.firstName,
                              t.employee?.lastName,
                            )}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {t.employee?.firstName} {t.employee?.lastName}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, fontWeight: 600 }}>
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
                        <span
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ● {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {timesheets.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-icon">
                          <MdAssignment />
                        </div>
                        <div className="empty-title">No timesheet data</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ATTENDANCE REPORT */}
      {activeReport === "attendance" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Attendance Report</div>
              <div className="card-subtitle">
                {attendance.length} records · {new Date().toLocaleDateString()}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={exportAttendance}
              style={{ fontSize: 12 }}
            >
              <MdDownload size={14} /> Export CSV
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => {
                  const sc = statusColors[a.status] || statusColors.PRESENT;
                  const dur =
                    a.workingMinutes > 0
                      ? `${Math.floor(a.workingMinutes / 60)}h ${a.workingMinutes % 60}m`
                      : "—";
                  return (
                    <tr key={a.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              flexShrink: 0,
                              background:
                                avatarColors[i % avatarColors.length].bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              color: avatarColors[i % avatarColors.length].text,
                            }}
                          >
                            {getInitials(
                              a.employee?.firstName,
                              a.employee?.lastName,
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>
                              {a.employee?.firstName} {a.employee?.lastName}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                              {a.employee?.employeeCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          fontWeight: 700,
                          color: "#16a34a",
                          fontSize: 13,
                        }}
                      >
                        {a.checkIn
                          ? new Date(a.checkIn).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td
                        style={{
                          fontWeight: 700,
                          color: "#d97706",
                          fontSize: 13,
                        }}
                      >
                        {a.checkOut ? (
                          new Date(a.checkOut).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        ) : (
                          <span
                            style={{
                              color: "#16a34a",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            ● In progress
                          </span>
                        )}
                      </td>
                      <td>
                        {a.workingMinutes > 0 ? (
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#0f172a",
                              padding: "4px 12px",
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
                            {dur}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ● {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <div className="empty-icon">
                          <MdAccessTime />
                        </div>
                        <div className="empty-title">
                          No attendance data today
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
