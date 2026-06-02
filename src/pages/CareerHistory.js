import React, { useState, useEffect } from "react";
import { careerHistoryAPI, employeeAPI } from "../services/api";
import { MdTimeline, MdPerson } from "react-icons/md";

const cardColors = {
  LOCATION: { cls: "tl-card-orange", dot: "#d97706" },
  DESIGNATION: { cls: "tl-card-green", dot: "#16a34a" },
  DEPARTMENT: { cls: "tl-card-blue", dot: "#2563eb" },
  ONBOARDING: { cls: "tl-card-purple", dot: "#7c3aed" },
  STATUS: { cls: "tl-card-red", dot: "#dc2626" },
  SALARY: { cls: "tl-card-green", dot: "#16a34a" },
  REPORTING_TO: { cls: "tl-card-blue", dot: "#2563eb" },
  EMPLOYMENT_TYPE: { cls: "tl-card-purple", dot: "#7c3aed" },
};

const CareerHistory = () => {
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedEmpData, setSelectedEmpData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!id) {
      setHistory([]);
      setSelectedEmpData(null);
      return;
    }
    const emp = employees.find((em) => em.id === parseInt(id));
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
          <div className="page-subtitle">View employee career progression</div>
        </div>
      </div>

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
                    {e.designation?.title || "N/A"}
                  </option>
                ))}
              </select>
            </div>
            {selectedEmpData && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                }}
              >
                <div
                  className="avatar avatar-slate"
                  style={{
                    width: 44,
                    height: 44,
                    fontSize: 15,
                    borderRadius: 12,
                  }}
                >
                  {getInitials(
                    selectedEmpData.firstName,
                    selectedEmpData.lastName,
                  )}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}
                  >
                    {selectedEmpData.firstName} {selectedEmpData.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#334155",
                      fontWeight: 700,
                      marginTop: 1,
                    }}
                  >
                    {selectedEmpData.employeeCode}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                    {selectedEmpData.designation?.title || "N/A"} ·{" "}
                    {selectedEmpData.department?.name || "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <MdTimeline size={28} /> Loading...
        </div>
      )}

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

      {!loading && selectedEmp && history.length === 0 && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">
                <MdTimeline />
              </div>
              <div className="empty-title">No career history</div>
              <div className="empty-sub">
                No changes recorded for this employee yet
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Career Timeline</div>
            <div className="card-subtitle">
              {history.length} recorded changes
            </div>
          </div>
          <div className="card-body">
            {Object.keys(grouped)
              .sort((a, b) => b - a)
              .map((year) => (
                <div key={year}>
                  <div className="tl-year">{year}</div>
                  {grouped[year].map((item) => {
                    const c = cardColors[item.changeType] || {
                      cls: "tl-card-gray",
                      dot: "#94a3b8",
                    };
                    return (
                      <div className="tl-item" key={item.id}>
                        <div className="tl-date-col">
                          <div className="tl-day">
                            {new Date(item.changedAt).getDate()}
                          </div>
                          <div className="tl-month">
                            {new Date(item.changedAt).toLocaleString(
                              "default",
                              { month: "short" },
                            )}
                          </div>
                        </div>
                        <div className="tl-connector">
                          <div
                            className="tl-dot"
                            style={{ borderColor: c.dot }}
                          />
                          <div className="tl-line" />
                        </div>
                        <div className={`tl-card ${c.cls}`}>
                          <div className="tl-row">
                            <span className="tl-key">Type:</span>
                            <span className="tl-val">
                              {item.changeType?.replace("_", " ")}
                            </span>
                            {item.oldValue && (
                              <>
                                <span className="tl-key">From:</span>
                                <span
                                  style={{
                                    color: "#94a3b8",
                                    fontWeight: 500,
                                    fontSize: 12,
                                  }}
                                >
                                  {item.oldValue}
                                </span>
                              </>
                            )}
                            {item.newValue && (
                              <>
                                <span className="tl-key">To:</span>
                                <span className="tl-val">{item.newValue}</span>
                              </>
                            )}
                            {item.message && (
                              <>
                                <span className="tl-key">Note:</span>
                                <span className="tl-msg">{item.message}</span>
                              </>
                            )}
                          </div>
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
