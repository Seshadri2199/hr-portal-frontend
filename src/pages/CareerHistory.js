import React, { useState, useEffect } from "react";
import { careerHistoryAPI, employeeAPI } from "../services/api";
import { MdTimeline, MdPerson, MdAdd, MdClose, MdWork } from "react-icons/md";

const changeTypeConfig = {
  DESIGNATION: {
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
    dot: "#16a34a",
    icon: "🏷️",
  },
  DEPARTMENT: {
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
    dot: "#2563eb",
    icon: "🏢",
  },
  LOCATION: {
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    dot: "#d97706",
    icon: "📍",
  },
  SALARY: {
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
    dot: "#16a34a",
    icon: "💰",
  },
  STATUS: {
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecdd3",
    dot: "#dc2626",
    icon: "🔄",
  },
  REPORTING_TO: {
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
    dot: "#2563eb",
    icon: "👤",
  },
  EMPLOYMENT_TYPE: {
    bg: "#faf5ff",
    color: "#7c3aed",
    border: "#ddd6fe",
    dot: "#7c3aed",
    icon: "📋",
  },
  ONBOARDING: {
    bg: "#faf5ff",
    color: "#7c3aed",
    border: "#ddd6fe",
    dot: "#7c3aed",
    icon: "🎉",
  },
};

const changeTypeLabels = {
  DESIGNATION: "Designation Change",
  DEPARTMENT: "Department Transfer",
  LOCATION: "Location Change",
  SALARY: "Salary Revision",
  STATUS: "Status Change",
  REPORTING_TO: "Reporting Manager Change",
  EMPLOYMENT_TYPE: "Employment Type Change",
  ONBOARDING: "Onboarding",
};

const CareerHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedEmpData, setSelectedEmpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    changeType: "DESIGNATION",
    oldValue: "",
    newValue: "",
    message: "",
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeAPI.getActive();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmpChange = async (e) => {
    const id = e.target.value;
    setSelectedEmp(id);
    setShowForm(false);
    if (!id) {
      setHistory([]);
      setSelectedEmpData(null);
      return;
    }
    const emp = employees.find((em) => String(em.id) === String(id));
    setSelectedEmpData(emp);
    setLoading(true);
    try {
      const res = await careerHistoryAPI.getByEmployee(id);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHistory = async () => {
    if (!form.newValue) {
      alert("Please fill in the new value");
      return;
    }
    setSaving(true);
    try {
      await careerHistoryAPI.add(selectedEmp, {
        changeType: form.changeType,
        oldValue: form.oldValue,
        newValue: form.newValue,
        message: form.message,
        changedById: String(user?.employeeId || "4"),
      });
      setShowForm(false);
      setForm({
        changeType: "DESIGNATION",
        oldValue: "",
        newValue: "",
        message: "",
      });
      const res = await careerHistoryAPI.getByEmployee(selectedEmp);
      setHistory(res.data);
    } catch (err) {
      alert(
        "Error adding career history: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setSaving(false);
    }
  };

  const groupByYear = (items) =>
    items.reduce((acc, item) => {
      const year = new Date(item.changedAt).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});

  const grouped = groupByYear(history);
  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Career History</div>
          <div className="page-subtitle">
            Track employee career progression and changes
          </div>
        </div>
        {selectedEmp && isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
            {showForm ? "Cancel" : "Add Career Event"}
          </button>
        )}
      </div>

      {/* Employee Selector */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 260 }}>
              <label
                className="form-label"
                style={{ marginBottom: 6, display: "block" }}
              >
                Select Employee
              </label>
              <select
                className="form-control"
                value={selectedEmp}
                onChange={handleEmpChange}
                style={{ maxWidth: 400 }}
              >
                <option value="">— Choose an employee —</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.employeeCode} · {e.firstName} {e.lastName} ·{" "}
                    {e.designationTitle || "N/A"}
                  </option>
                ))}
              </select>
            </div>

            {selectedEmpData && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#f8fafc",
                  padding: "14px 20px",
                  borderRadius: 12,
                  border: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1e40af",
                  }}
                >
                  {getInitials(
                    selectedEmpData.firstName,
                    selectedEmpData.lastName,
                  )}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}
                  >
                    {selectedEmpData.firstName} {selectedEmpData.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#334155",
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {selectedEmpData.employeeCode}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {selectedEmpData.designationTitle || "No designation"} ·{" "}
                    {selectedEmpData.departmentName || "No department"}
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: 10,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  ● {history.length} events
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Career Event Form */}
      {showForm && selectedEmp && isAdmin && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Add Career Event</div>
              <div className="card-subtitle">
                Recording change for {selectedEmpData?.firstName}{" "}
                {selectedEmpData?.lastName}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label className="form-label">Change Type *</label>
                <select
                  className="form-control"
                  value={form.changeType}
                  onChange={(e) =>
                    setForm({ ...form, changeType: e.target.value })
                  }
                >
                  {Object.entries(changeTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Previous Value</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What was it before? (optional)"
                  value={form.oldValue}
                  onChange={(e) =>
                    setForm({ ...form, oldValue: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Value *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="What is the new value?"
                  value={form.newValue}
                  onChange={(e) =>
                    setForm({ ...form, newValue: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Note / Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Additional notes (optional)"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>
            </div>

            {form.newValue && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background:
                    changeTypeConfig[form.changeType]?.bg || "#f8fafc",
                  border: `1px solid ${changeTypeConfig[form.changeType]?.border || "#e2e8f0"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: changeTypeConfig[form.changeType]?.color || "#334155",
                }}
              >
                <MdWork size={16} />
                <span>
                  <strong>{changeTypeLabels[form.changeType]}</strong>
                  {form.oldValue && (
                    <>
                      {" "}
                      — from <strong>{form.oldValue}</strong>
                    </>
                  )}
                  {" → "}
                  <strong>{form.newValue}</strong>
                  {form.message && <> · {form.message}</>}
                </span>
              </div>
            )}

            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleAddHistory}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Career Event"}
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

      {/* Empty states */}
      {!loading && !selectedEmp && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">
                <MdPerson />
              </div>
              <div className="empty-title">Select an employee</div>
              <div className="empty-sub">
                Choose an employee above to view their career timeline
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <MdTimeline size={28} />
          Loading career history...
        </div>
      )}

      {!loading && selectedEmp && history.length === 0 && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">
                <MdTimeline />
              </div>
              <div className="empty-title">No career history yet</div>
              <div className="empty-sub">
                {isAdmin
                  ? 'Click "Add Career Event" to record the first change'
                  : "No changes recorded for this employee yet"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {!loading && history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Career Timeline</div>
              <div className="card-subtitle">
                {history.length} recorded events
              </div>
            </div>
          </div>
          <div className="card-body">
            {Object.keys(grouped)
              .sort((a, b) => b - a)
              .map((year) => (
                <div key={year}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      margin: "20px 0 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{ flex: 1, height: 1, background: "#f1f5f9" }}
                    />
                    {year}
                    <div
                      style={{ flex: 1, height: 1, background: "#f1f5f9" }}
                    />
                  </div>
                  {grouped[year].map((item) => {
                    const c = changeTypeConfig[item.changeType] || {
                      bg: "#f8fafc",
                      color: "#475569",
                      border: "#e2e8f0",
                      dot: "#94a3b8",
                      icon: "📌",
                    };
                    return (
                      <div
                        key={item.id}
                        style={{ display: "flex", gap: 16, marginBottom: 14 }}
                      >
                        <div
                          style={{
                            width: 56,
                            textAlign: "right",
                            flexShrink: 0,
                            paddingTop: 6,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 800,
                              color: "#0f172a",
                              lineHeight: 1,
                            }}
                          >
                            {new Date(item.changedAt).getDate()}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#94a3b8",
                              fontWeight: 700,
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
                              width: 14,
                              height: 14,
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
                              background: "#f1f5f9",
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
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 10,
                            }}
                          >
                            <span style={{ fontSize: 16 }}>{c.icon}</span>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: c.color,
                              }}
                            >
                              {changeTypeLabels[item.changeType] ||
                                item.changeType?.replace(/_/g, " ")}
                            </span>
                            <span
                              style={{
                                marginLeft: "auto",
                                fontSize: 11,
                                color: "#94a3b8",
                                fontWeight: 600,
                              }}
                            >
                              {new Date(item.changedAt).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 20,
                              flexWrap: "wrap",
                            }}
                          >
                            {item.oldValue && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#94a3b8",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: 2,
                                  }}
                                >
                                  From
                                </div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    color: "#64748b",
                                    fontWeight: 500,
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {item.oldValue}
                                </div>
                              </div>
                            )}
                            {item.newValue && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#94a3b8",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: 2,
                                  }}
                                >
                                  To
                                </div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    color: c.color,
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.newValue}
                                </div>
                              </div>
                            )}
                            {item.changedBy && (
                              <div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#94a3b8",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    marginBottom: 2,
                                  }}
                                >
                                  Changed By
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#334155",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.changedBy?.firstName}{" "}
                                  {item.changedBy?.lastName}
                                </div>
                              </div>
                            )}
                          </div>
                          {item.message && (
                            <div
                              style={{
                                marginTop: 10,
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: "rgba(0,0,0,0.04)",
                                fontSize: 12,
                                color: "#64748b",
                                fontStyle: "italic",
                              }}
                            >
                              💬 {item.message}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerHistory;
