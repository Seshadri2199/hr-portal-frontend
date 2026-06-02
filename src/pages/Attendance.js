import React, { useState, useEffect } from "react";
import { attendanceAPI, employeeAPI } from "../services/api";
import { MdAccessTime, MdLogin, MdLogout, MdPeople } from "react-icons/md";

const avatarColors = [
  "avatar-blue",
  "avatar-green",
  "avatar-orange",
  "avatar-purple",
  "avatar-red",
  "avatar-teal",
];

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);

  useEffect(() => {
    loadEmployees();
    loadTodayAttendance();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeAPI.getActive();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [attRes, countRes] = await Promise.all([
        attendanceAPI.getByDate(today),
        attendanceAPI.countPresentToday(),
      ]);
      setAttendance(attRes.data);
      setPresentCount(countRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedEmp) {
      alert("Please select an employee");
      return;
    }
    try {
      await attendanceAPI.checkIn(selectedEmp);
      await loadTodayAttendance();
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
      await loadTodayAttendance();
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
  const getInitials = (emp) =>
    `${emp?.firstName?.charAt(0) || ""}${emp?.lastName?.charAt(0) || ""}`.toUpperCase();

  if (loading)
    return (
      <div className="loading">
        <MdAccessTime size={28} />
        Loading attendance...
      </div>
    );

  return (
    <div className="content">
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
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              background: "#f0fdf4",
              padding: "10px 18px",
              borderRadius: 10,
              border: "1px solid #bbf7d0",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>
              {presentCount}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Present
            </div>
          </div>
          <div
            style={{
              background: "#fef2f2",
              padding: "10px 18px",
              borderRadius: 10,
              border: "1px solid #fecdd3",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#dc2626" }}>
              {employees.length - presentCount}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Absent
            </div>
          </div>
        </div>
      </div>

      <div className="checkin-card">
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
            Mark Attendance
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 500,
            }}
          >
            Select an employee and mark their attendance for today
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            className="checkin-select"
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
          >
            <option value="">— Select Employee —</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employeeCode} · {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={handleCheckIn}
            style={{
              padding: "9px 20px",
              borderRadius: 9,
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
            }}
          >
            <MdLogin size={15} /> Check In
          </button>
          <button
            onClick={handleCheckOut}
            style={{
              padding: "9px 20px",
              borderRadius: 9,
              border: "none",
              background: "#d97706",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
            }}
          >
            <MdLogout size={15} /> Check Out
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Today's Attendance</div>
            <div className="card-subtitle">{attendance.length} records</div>
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
              {attendance.map((a, i) => (
                <tr key={a.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        className={`avatar ${avatarColors[i % avatarColors.length]}`}
                      >
                        {getInitials(a.employee)}
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
                  <td style={{ fontWeight: 700, color: "#16a34a" }}>
                    {formatTime(a.checkIn)}
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      color: a.checkOut ? "#d97706" : "#94a3b8",
                    }}
                  >
                    {a.checkOut ? formatTime(a.checkOut) : "In progress"}
                  </td>
                  <td>
                    {a.workingMinutes > 0 ? (
                      <span style={{ fontWeight: 700, color: "#334155" }}>
                        {Math.floor(a.workingMinutes / 60)}h{" "}
                        {a.workingMinutes % 60}m
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
    </div>
  );
};

export default Attendance;
