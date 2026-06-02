import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  employeeAPI,
  attendanceAPI,
  leaveAPI,
  timesheetAPI,
  careerHistoryAPI,
} from "../services/api";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
  MdCalendarToday,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdTimeline,
  MdEdit,
} from "react-icons/md";

const avatarColors = [
  "#4f8ef7",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#f43f5e",
  "#14b8a6",
];

const cardColors = {
  LOCATION: { bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
  DESIGNATION: { bg: "#f0fdf4", border: "#bbf7d0", dot: "#10b981" },
  DEPARTMENT: { bg: "#eff6ff", border: "#bfdbfe", dot: "#4f8ef7" },
  ONBOARDING: { bg: "#faf5ff", border: "#ddd6fe", dot: "#8b5cf6" },
  STATUS: { bg: "#fff1f2", border: "#fecdd3", dot: "#f43f5e" },
  SALARY: { bg: "#f0fdf4", border: "#bbf7d0", dot: "#10b981" },
  REPORTING_TO: { bg: "#eff6ff", border: "#bfdbfe", dot: "#4f8ef7" },
};

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    style={{
      padding: "12px 20px",
      border: "none",
      cursor: "pointer",
      background: active ? "#fff" : "transparent",
      color: active ? "#1a2340" : "#9ba8c5",
      fontWeight: active ? 800 : 600,
      fontSize: 13,
      borderBottom: active ? "2px solid #4f8ef7" : "2px solid transparent",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    }}
  >
    {icon}
    {label}
    {count !== undefined && (
      <span
        style={{
          background: active ? "#4f8ef7" : "#e4e9f2",
          color: active ? "#fff" : "#9ba8c5",
          borderRadius: 20,
          padding: "1px 7px",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    )}
  </button>
);

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    try {
      const [empRes, attRes, leaveRes, tsRes, histRes] = await Promise.all([
        employeeAPI.getById(id),
        attendanceAPI.getByEmployee(id),
        leaveAPI.getByEmployee(id),
        timesheetAPI.getByEmployee(id),
        careerHistoryAPI.getByEmployee(id),
      ]);
      setEmployee(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setTimesheets(tsRes.data);
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED").length;
  const totalHours = timesheets.reduce(
    (sum, t) => sum + parseFloat(t.hoursLogged || 0),
    0,
  );

  const groupByYear = (items) =>
    items.reduce((acc, item) => {
      const year = new Date(item.changedAt).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});

  if (loading)
    return (
      <div className="loading">
        <MdPerson size={36} />
        <span>Loading profile...</span>
      </div>
    );

  if (!employee)
    return (
      <div className="content">
        <div className="empty-state">
          <div className="empty-icon">
            <MdPerson />
          </div>
          <div className="empty-title">Employee not found</div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/employees")}
          >
            Back to Employees
          </button>
        </div>
      </div>
    );

  return (
    <div className="content">
      {/* Back button */}
      <button
        onClick={() => navigate("/employees")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9ba8c5",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
          padding: 0,
        }}
      >
        <MdArrowBack size={18} /> Back to Employees
      </button>

      {/* Profile Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a2340 0%, #263354 100%)",
          borderRadius: 20,
          padding: "32px 36px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(79,142,247,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: 200,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.1)",
            pointerEvents: "none",
          }}
        />

        {/* Avatar */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 24,
            background: getAvatarColor(employee.id),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
            boxShadow: `0 8px 24px ${getAvatarColor(employee.id)}55`,
          }}
        >
          {getInitials(employee.firstName, employee.lastName)}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}
          >
            {employee.firstName} {employee.lastName}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 500,
              marginBottom: 12,
            }}
          >
            {employee.designation?.title || "No designation"} ·{" "}
            {employee.department?.name || "No department"}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(79,142,247,0.2)",
                color: "#93c5fd",
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(79,142,247,0.3)",
              }}
            >
              {employee.employeeCode}
            </span>
            <span
              style={{
                background: "rgba(16,185,129,0.2)",
                color: "#6ee7b7",
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              ● {employee.status}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                padding: "4px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {employee.employmentType?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Days Present", value: presentDays, color: "#10b981" },
            { label: "Leaves Taken", value: approvedLeaves, color: "#f59e0b" },
            {
              label: "Hours Logged",
              value: `${totalHours.toFixed(0)}h`,
              color: "#4f8ef7",
            },
            { label: "Career Events", value: history.length, color: "#8b5cf6" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.08)",
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                minWidth: 90,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info Bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          border: "1px solid #e4e9f2",
        }}
      >
        {[
          {
            icon: <MdEmail size={16} />,
            label: "Email",
            value: employee.email,
            color: "#4f8ef7",
          },
          {
            icon: <MdPhone size={16} />,
            label: "Phone",
            value: employee.phone || "Not provided",
            color: "#10b981",
          },
          {
            icon: <MdCalendarToday size={16} />,
            label: "Joined",
            value: employee.dateOfJoining,
            color: "#f59e0b",
          },
          {
            icon: <MdLocationOn size={16} />,
            label: "Location",
            value: employee.department?.location || "Not set",
            color: "#8b5cf6",
          },
          {
            icon: <MdWork size={16} />,
            label: "Reports To",
            value: employee.reportingTo
              ? `${employee.reportingTo.firstName} ${employee.reportingTo.lastName}`
              : "No manager",
            color: "#f43f5e",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: `${item.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#9ba8c5",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2340" }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e4e9f2",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #f0f3fa",
            padding: "0 8px",
            overflowX: "auto",
          }}
        >
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<MdPerson size={16} />}
            label="Overview"
          />
          <TabButton
            active={activeTab === "attendance"}
            onClick={() => setActiveTab("attendance")}
            icon={<MdAccessTime size={16} />}
            label="Attendance"
            count={attendance.length}
          />
          <TabButton
            active={activeTab === "leave"}
            onClick={() => setActiveTab("leave")}
            icon={<MdEventNote size={16} />}
            label="Leave"
            count={leaves.length}
          />
          <TabButton
            active={activeTab === "timesheets"}
            onClick={() => setActiveTab("timesheets")}
            icon={<MdAssignment size={16} />}
            label="Timesheets"
            count={timesheets.length}
          />
          <TabButton
            active={activeTab === "career"}
            onClick={() => setActiveTab("career")}
            icon={<MdTimeline size={16} />}
            label="Career History"
            count={history.length}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {/* Personal Info */}
              <div
                style={{
                  background: "#f8faff",
                  borderRadius: 14,
                  padding: 20,
                  border: "1px solid #e4e9f2",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#1a2340",
                    marginBottom: 16,
                  }}
                >
                  Personal Information
                </div>
                {[
                  ["Full Name", `${employee.firstName} ${employee.lastName}`],
                  ["Email", employee.email],
                  ["Phone", employee.phone || "Not provided"],
                  ["Gender", employee.gender || "Not specified"],
                  ["Date of Birth", employee.dateOfBirth || "Not provided"],
                  ["Address", employee.address || "Not provided"],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #e4e9f2",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#9ba8c5",
                        fontWeight: 600,
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#1a2340",
                        fontWeight: 600,
                        textAlign: "right",
                        maxWidth: 200,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Employment Info */}
              <div
                style={{
                  background: "#f8faff",
                  borderRadius: 14,
                  padding: 20,
                  border: "1px solid #e4e9f2",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#1a2340",
                    marginBottom: 16,
                  }}
                >
                  Employment Information
                </div>
                {[
                  ["Employee Code", employee.employeeCode],
                  ["Department", employee.department?.name || "Not assigned"],
                  [
                    "Designation",
                    employee.designation?.title || "Not assigned",
                  ],
                  [
                    "Employment Type",
                    employee.employmentType?.replace("_", " ") || "—",
                  ],
                  ["Status", employee.status],
                  ["Date of Joining", employee.dateOfJoining],
                  [
                    "Reporting To",
                    employee.reportingTo
                      ? `${employee.reportingTo.firstName} ${employee.reportingTo.lastName}`
                      : "Not assigned",
                  ],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #e4e9f2",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#9ba8c5",
                        fontWeight: 600,
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#1a2340",
                        fontWeight: 600,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div>
            {/* Summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                padding: 24,
                borderBottom: "1px solid #f0f3fa",
              }}
            >
              {[
                {
                  label: "Total Days",
                  value: attendance.length,
                  color: "#4f8ef7",
                  bg: "#eff4ff",
                },
                {
                  label: "Present",
                  value: attendance.filter((a) => a.status === "PRESENT")
                    .length,
                  color: "#10b981",
                  bg: "#ecfdf5",
                },
                {
                  label: "Absent",
                  value: attendance.filter((a) => a.status === "ABSENT").length,
                  color: "#f43f5e",
                  bg: "#fff1f2",
                },
                {
                  label: "On Leave",
                  value: attendance.filter((a) => a.status === "ON_LEAVE")
                    .length,
                  color: "#8b5cf6",
                  bg: "#f5f3ff",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: s.bg,
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 28, fontWeight: 900, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ba8c5",
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{a.attendanceDate}</td>
                      <td style={{ color: "#10b981", fontWeight: 700 }}>
                        {formatTime(a.checkIn)}
                      </td>
                      <td style={{ color: "#f59e0b", fontWeight: 700 }}>
                        {formatTime(a.checkOut)}
                      </td>
                      <td>
                        {a.workingMinutes > 0 ? (
                          <span style={{ fontWeight: 700, color: "#4f8ef7" }}>
                            {Math.floor(a.workingMinutes / 60)}h{" "}
                            {a.workingMinutes % 60}m
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${a.status?.toLowerCase()}`}
                        >
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
                          color: "#9ba8c5",
                        }}
                      >
                        No attendance records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave Tab */}
        {activeTab === "leave" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                padding: 24,
                borderBottom: "1px solid #f0f3fa",
              }}
            >
              {[
                {
                  label: "Total Requests",
                  value: leaves.length,
                  color: "#4f8ef7",
                  bg: "#eff4ff",
                },
                {
                  label: "Approved",
                  value: leaves.filter((l) => l.status === "APPROVED").length,
                  color: "#10b981",
                  bg: "#ecfdf5",
                },
                {
                  label: "Pending",
                  value: leaves.filter((l) => l.status === "PENDING").length,
                  color: "#f59e0b",
                  bg: "#fffbeb",
                },
                {
                  label: "Rejected",
                  value: leaves.filter((l) => l.status === "REJECTED").length,
                  color: "#f43f5e",
                  bg: "#fff1f2",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: s.bg,
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 28, fontWeight: 900, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ba8c5",
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <span
                          style={{
                            background: "#eff4ff",
                            color: "#4f8ef7",
                            padding: "3px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {l.leaveType?.name}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{l.fromDate}</td>
                      <td style={{ fontSize: 12 }}>{l.toDate}</td>
                      <td style={{ fontWeight: 800 }}>{l.totalDays}</td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>
                        {l.reason || "—"}
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
                  {leaves.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: 40,
                          color: "#9ba8c5",
                        }}
                      >
                        No leave records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Timesheets Tab */}
        {activeTab === "timesheets" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                padding: 24,
                borderBottom: "1px solid #f0f3fa",
              }}
            >
              {[
                {
                  label: "Total Entries",
                  value: timesheets.length,
                  color: "#4f8ef7",
                  bg: "#eff4ff",
                },
                {
                  label: "Total Hours",
                  value: `${totalHours.toFixed(1)}h`,
                  color: "#10b981",
                  bg: "#ecfdf5",
                },
                {
                  label: "Approved",
                  value: timesheets.filter((t) => t.status === "APPROVED")
                    .length,
                  color: "#8b5cf6",
                  bg: "#f5f3ff",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: s.bg,
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 28, fontWeight: 900, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ba8c5",
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
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
                        <span
                          style={{
                            fontWeight: 800,
                            color: "#4f8ef7",
                            background: "#eff4ff",
                            padding: "3px 10px",
                            borderRadius: 8,
                          }}
                        >
                          {t.hoursLogged}h
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{t.project || "—"}</td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>
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
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: 40,
                          color: "#9ba8c5",
                        }}
                      >
                        No timesheet records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Career History Tab */}
        {activeTab === "career" && (
          <div style={{ padding: 24 }}>
            {history.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <MdTimeline />
                </div>
                <div className="empty-title">No career history</div>
                <div className="empty-sub">No changes recorded yet</div>
              </div>
            ) : (
              Object.keys(groupByYear(history))
                .sort((a, b) => b - a)
                .map((year) => (
                  <div key={year}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#1a2340",
                        margin: "16px 0 12px",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {year}
                    </div>
                    {groupByYear(history)[year].map((item) => {
                      const c = cardColors[item.changeType] || {
                        bg: "#f8faff",
                        border: "#e4e9f2",
                        dot: "#9ba8c5",
                      };
                      return (
                        <div
                          key={item.id}
                          style={{ display: "flex", gap: 16, marginBottom: 12 }}
                        >
                          <div
                            style={{
                              width: 64,
                              textAlign: "right",
                              flexShrink: 0,
                              paddingTop: 6,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 20,
                                fontWeight: 900,
                                color: "#1a2340",
                                lineHeight: 1,
                              }}
                            >
                              {new Date(item.changedAt).getDate()}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#9ba8c5",
                                fontWeight: 600,
                                textTransform: "uppercase",
                              }}
                            >
                              {new Date(item.changedAt).toLocaleString(
                                "default",
                                { month: "short" },
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              width: 22,
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: `2.5px solid ${c.dot}`,
                                background: "#fff",
                                flexShrink: 0,
                                marginTop: 7,
                              }}
                            />
                            <div
                              style={{
                                width: 2,
                                flex: 1,
                                background: "#e4e9f2",
                                marginTop: 4,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              flex: 1,
                              background: c.bg,
                              borderRadius: 12,
                              padding: "14px 18px",
                              border: `1.5px solid ${c.border}`,
                              marginBottom: 4,
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "110px 1fr",
                                gap: "4px 8px",
                                fontSize: 13,
                              }}
                            >
                              <span
                                style={{ color: "#9ba8c5", fontWeight: 600 }}
                              >
                                Type:
                              </span>
                              <span
                                style={{ color: "#1a2340", fontWeight: 700 }}
                              >
                                {item.changeType?.replace("_", " ")}
                              </span>
                              {item.oldValue && (
                                <>
                                  <span
                                    style={{
                                      color: "#9ba8c5",
                                      fontWeight: 600,
                                    }}
                                  >
                                    From:
                                  </span>
                                  <span
                                    style={{
                                      color: "#9ba8c5",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item.oldValue}
                                  </span>
                                </>
                              )}
                              {item.newValue && (
                                <>
                                  <span
                                    style={{
                                      color: "#9ba8c5",
                                      fontWeight: 600,
                                    }}
                                  >
                                    To:
                                  </span>
                                  <span
                                    style={{
                                      color: "#1a2340",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {item.newValue}
                                  </span>
                                </>
                              )}
                              {item.message && (
                                <>
                                  <span
                                    style={{
                                      color: "#9ba8c5",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Note:
                                  </span>
                                  <span
                                    style={{
                                      color: "#6b7280",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {item.message}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
