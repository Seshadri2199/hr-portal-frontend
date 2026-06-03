import React, { useState, useEffect, useCallback } from "react";
import { attendanceAPI, employeeAPI } from "../services/api";
import {
  MdAccessTime,
  MdLogin,
  MdLogout,
  MdPeople,
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const statusColors = {
  PRESENT: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  ABSENT: { bg: "#fef2f2", color: "#dc2626", border: "#fecdd3" },
  HALF_DAY: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  ON_LEAVE: { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
  HOLIDAY: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  WEEKEND: { bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0" },
};

const avatarColors = [
  { bg: "#eff6ff", text: "#1e40af" },
  { bg: "#f0fdf4", text: "#166534" },
  { bg: "#fffbeb", text: "#92400e" },
  { bg: "#faf5ff", text: "#5b21b6" },
  { bg: "#fef2f2", text: "#991b1b" },
  { bg: "#f0fdfa", text: "#134e4a" },
];

const LiveTimer = ({ checkIn }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!checkIn) return;
    const checkInTime = new Date(checkIn).getTime();
    const update = () =>
      setElapsed(Math.floor((Date.now() - checkInTime) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [checkIn]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 28,
        fontWeight: 800,
        color: "#22c55e",
        letterSpacing: "3px",
        background: "rgba(34,197,94,0.08)",
        padding: "10px 20px",
        borderRadius: 12,
        border: "1px solid rgba(34,197,94,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
};

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedEmpAttendance, setSelectedEmpAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [calendarEmp, setCalendarEmp] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  const today = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    try {
      const [attRes, countRes, empRes] = await Promise.all([
        attendanceAPI.getByDate(today),
        attendanceAPI.countPresentToday(),
        employeeAPI.getActive(),
      ]);
      setAttendance(attRes.data);
      setPresentCount(countRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedEmp) {
      const empAtt = attendance.find(
        (a) => String(a.employee?.id) === String(selectedEmp),
      );
      setSelectedEmpAttendance(empAtt || null);
    } else {
      setSelectedEmpAttendance(null);
    }
  }, [selectedEmp, attendance]);

  useEffect(() => {
    if (calendarEmp) loadCalendar();
  }, [calendarMonth, calendarEmp]);

  const loadCalendar = async () => {
    try {
      const res = await attendanceAPI.getByEmployee(calendarEmp);
      setCalendarData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedEmp) {
      alert("Please select an employee");
      return;
    }
    try {
      await attendanceAPI.checkIn(selectedEmp);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Already checked in today");
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmp) {
      alert("Please select an employee");
      return;
    }
    try {
      await attendanceAPI.checkOut(selectedEmp);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "No check-in found");
    }
  };

  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return "—";
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const getAttForDay = (day) => {
    const { year, month } = getDaysInMonth(calendarMonth);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarData.find((a) => a.attendanceDate === dateStr);
  };

  const isWeekend = (day) => {
    const { year, month } = getDaysInMonth(calendarMonth);
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  };

  const { firstDay, daysInMonth } = getDaysInMonth(calendarMonth);
  const absentCount = employees.length - presentCount;
  const isWorking =
    selectedEmpAttendance?.checkIn && !selectedEmpAttendance?.checkOut;

  if (loading)
    return (
      <div className="loading">
        <MdAccessTime size={28} />
        Loading attendance...
      </div>
    );

  return (
    <div className="content">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Attendance</div>
          <div className="page-subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        {/* Summary pills */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            {
              label: "Present",
              value: presentCount,
              bg: "#f0fdf4",
              color: "#16a34a",
              border: "#bbf7d0",
            },
            {
              label: "Absent",
              value: absentCount,
              bg: "#fef2f2",
              color: "#dc2626",
              border: "#fecdd3",
            },
            {
              label: "Total",
              value: employees.length,
              bg: "#f1f5f9",
              color: "#334155",
              border: "#e2e8f0",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 10,
                padding: "8px 16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: item.color,
                  fontWeight: 700,
                  marginTop: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[
          {
            id: "today",
            label: "Today's Attendance",
            icon: <MdAccessTime size={15} />,
          },
          {
            id: "calendar",
            label: "Monthly Calendar",
            icon: <MdCalendarToday size={15} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              background: activeTab === tab.id ? "#0f172a" : "#f1f5f9",
              color: activeTab === tab.id ? "#fff" : "#64748b",
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "all 150ms",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TODAY TAB */}
      {activeTab === "today" && (
        <>
          {/* Check-in Panel */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: 16,
              padding: "24px 28px",
              marginBottom: 20,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  Mark Attendance
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  Select employee and check in or out
                </div>
              </div>
              {selectedEmpAttendance?.checkIn &&
                !selectedEmpAttendance?.checkOut && (
                  <LiveTimer checkIn={selectedEmpAttendance.checkIn} />
                )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 220,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                }}
              >
                <option value="" style={{ background: "#0f172a" }}>
                  — Select Employee —
                </option>
                {employees.map((emp) => (
                  <option
                    key={emp.id}
                    value={emp.id}
                    style={{ background: "#0f172a" }}
                  >
                    {emp.employeeCode} · {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCheckIn}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                }}
              >
                <MdLogin size={16} /> Check In
              </button>

              <button
                onClick={handleCheckOut}
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: selectedEmpAttendance?.checkIn
                    ? "#d97706"
                    : "rgba(255,255,255,0.08)",
                  color: selectedEmpAttendance?.checkIn ? "#fff" : "#475569",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "var(--font-body)",
                  boxShadow: selectedEmpAttendance?.checkIn
                    ? "0 4px 12px rgba(217,119,6,0.3)"
                    : "none",
                }}
              >
                <MdLogout size={16} /> Check Out
              </button>
            </div>

            {/* Selected employee status */}
            {selectedEmp && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {selectedEmpAttendance ? (
                  <>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 600,
                        }}
                      >
                        Status:
                      </span>
                      <span
                        style={{
                          background: isWorking
                            ? "rgba(34,197,94,0.2)"
                            : "rgba(245,158,11,0.2)",
                          color: isWorking ? "#22c55e" : "#f59e0b",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        ● {isWorking ? "Currently Working" : "Checked Out"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span
                        style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
                      >
                        In:{" "}
                        <strong style={{ color: "#22c55e" }}>
                          {formatTime(selectedEmpAttendance.checkIn)}
                        </strong>
                      </span>
                      {selectedEmpAttendance.checkOut && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          Out:{" "}
                          <strong style={{ color: "#f59e0b" }}>
                            {formatTime(selectedEmpAttendance.checkOut)}
                          </strong>
                        </span>
                      )}
                      {selectedEmpAttendance.workingMinutes > 0 && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          Duration:{" "}
                          <strong style={{ color: "#fff" }}>
                            {formatDuration(
                              selectedEmpAttendance.workingMinutes,
                            )}
                          </strong>
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                    }}
                  >
                    ● Not checked in yet today
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Today's Records Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Today's Attendance Records</div>
                <div className="card-subtitle">
                  {attendance.length} records · {today}
                </div>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a, i) => {
                    const sc = statusColors[a.status] || statusColors.PRESENT;
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
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                flexShrink: 0,
                                background:
                                  avatarColors[i % avatarColors.length].bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 700,
                                color:
                                  avatarColors[i % avatarColors.length].text,
                              }}
                            >
                              {getInitials(
                                a.employee?.firstName,
                                a.employee?.lastName,
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 13,
                                  color: "#0f172a",
                                }}
                              >
                                {a.employee?.firstName} {a.employee?.lastName}
                              </div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {a.employee?.employeeCode}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#16a34a",
                              fontSize: 13,
                            }}
                          >
                            {formatTime(a.checkIn)}
                          </span>
                        </td>
                        <td>
                          {a.checkOut ? (
                            <span
                              style={{
                                fontWeight: 700,
                                color: "#d97706",
                                fontSize: 13,
                              }}
                            >
                              {formatTime(a.checkOut)}
                            </span>
                          ) : (
                            <span
                              style={{
                                background: "#f0fdf4",
                                color: "#16a34a",
                                padding: "3px 10px",
                                borderRadius: 20,
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
                              {formatDuration(a.workingMinutes)}
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
                              padding: "5px 14px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: sc.color,
                              }}
                            />
                            {a.status}
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
                            <MdPeople />
                          </div>
                          <div className="empty-title">
                            No attendance records yet
                          </div>
                          <div className="empty-sub">
                            Use the panel above to mark attendance
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Attendance Calendar</div>
              <div className="card-subtitle">
                Select an employee to view their attendance
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                value={calendarEmp}
                onChange={(e) => {
                  setCalendarEmp(e.target.value);
                }}
                className="form-control"
                style={{ width: 200 }}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                    ),
                  )
                }
                style={{
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <MdChevronLeft size={18} />
              </button>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0f172a",
                  minWidth: 130,
                  textAlign: "center",
                }}
              >
                {calendarMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                    ),
                  )
                }
                style={{
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <MdChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="card-body">
            {/* Day headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
                marginBottom: 6,
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    padding: "6px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
              }}
            >
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const att = calendarEmp ? getAttForDay(day) : null;
                const weekend = isWeekend(day);
                const { year, month } = getDaysInMonth(calendarMonth);
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dateStr === today;
                let bg = weekend ? "#f8fafc" : "#fff";
                let color = weekend ? "#94a3b8" : "#334155";
                let dotColor = null;
                if (att) {
                  const sc = statusColors[att.status] || statusColors.PRESENT;
                  bg = sc.bg;
                  color = sc.color;
                  dotColor = sc.color;
                }
                return (
                  <div
                    key={day}
                    style={{
                      background: bg,
                      borderRadius: 10,
                      padding: "10px 6px",
                      textAlign: "center",
                      border: isToday
                        ? "2px solid #3b82f6"
                        : "1px solid #f1f5f9",
                      minHeight: 60,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      transition: "all 150ms",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isToday ? 800 : 600,
                        color: isToday ? "#3b82f6" : color,
                      }}
                    >
                      {day}
                    </div>
                    {dotColor && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: dotColor,
                        }}
                      />
                    )}
                    {att && (
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color,
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {att.status === "PRESENT"
                          ? `${Math.floor((att.workingMinutes || 0) / 60)}h`
                          : att.status?.slice(0, 4)}
                      </div>
                    )}
                    {weekend && !att && (
                      <div
                        style={{
                          fontSize: 9,
                          color: "#cbd5e1",
                          fontWeight: 600,
                        }}
                      >
                        Off
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Present", color: "#16a34a", bg: "#f0fdf4" },
                { label: "Absent", color: "#dc2626", bg: "#fef2f2" },
                { label: "Half Day", color: "#d97706", bg: "#fffbeb" },
                { label: "On Leave", color: "#7c3aed", bg: "#faf5ff" },
                { label: "Weekend", color: "#94a3b8", bg: "#f8fafc" },
                {
                  label: "Today",
                  color: "#3b82f6",
                  bg: "#fff",
                  border: "2px solid #3b82f6",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: item.bg,
                      border: item.border || `1px solid ${item.color}44`,
                    }}
                  />
                  <span
                    style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
