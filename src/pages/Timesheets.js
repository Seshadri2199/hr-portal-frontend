import React, { useState, useEffect } from "react";
import { timesheetAPI, employeeAPI } from "../services/api";
import { MdAssignment, MdAdd, MdClose, MdCheck } from "react-icons/md";

const Timesheets = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [form, setForm] = useState({
    employeeId: "",
    workDate: "",
    hoursLogged: "",
    project: "",
    task: "",
    description: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [tsRes, empRes] = await Promise.all([
        timesheetAPI.getPending(),
        employeeAPI.getActive(),
      ]);
      setTimesheets(tsRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.employeeId || !form.workDate || !form.hoursLogged) {
      alert("Please fill required fields");
      return;
    }
    try {
      await timesheetAPI.create({
        employee: { id: form.employeeId },
        workDate: form.workDate,
        hoursLogged: form.hoursLogged,
        project: form.project,
        task: form.task,
        description: form.description,
        status: "SUBMITTED",
      });
      setShowForm(false);
      setForm({
        employeeId: "",
        workDate: "",
        hoursLogged: "",
        project: "",
        task: "",
        description: "",
      });
      loadAll();
    } catch (err) {
      alert("Error saving timesheet");
    }
  };

  const handleApprove = async (id) => {
    try {
      await timesheetAPI.approve(id, 1);
      loadAll();
    } catch (err) {
      alert("Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      await timesheetAPI.reject(id);
      loadAll();
    } catch (err) {
      alert("Error rejecting");
    }
  };

  const pendingCount = timesheets.filter(
    (t) => t.status === "SUBMITTED",
  ).length;
  const tabs = ["ALL", "SUBMITTED", "APPROVED", "REJECTED", "DRAFT"];
  const filtered =
    activeTab === "ALL"
      ? timesheets
      : timesheets.filter((t) => t.status === activeTab);

  if (loading)
    return (
      <div className="loading">
        <MdAssignment size={28} />
        Loading timesheets...
      </div>
    );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Timesheets</div>
          <div className="page-subtitle">
            {timesheets.length} entries · {pendingCount} pending
          </div>
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
            <div className="card-title">Log Timesheet Entry</div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label className="form-label">Employee *</label>
                <select
                  className="form-control"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm({ ...form, employeeId: e.target.value })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName}
                    </option>
                  ))}
                </select>
              </div>
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
                  placeholder="Task description"
                  value={form.task}
                  onChange={(e) => setForm({ ...form, task: e.target.value })}
                />
              </div>
              <div className="form-group">
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
          <div>
            <div className="card-title">Timesheet Records</div>
            <div className="card-subtitle">{filtered.length} records</div>
          </div>
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === "SUBMITTED" && pendingCount > 0 && (
                  <span
                    style={{
                      background: "#334155",
                      color: "#fff",
                      borderRadius: 20,
                      padding: "1px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      marginLeft: 2,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700 }}>
                    {t.employee?.firstName} {t.employee?.lastName}
                  </td>
                  <td style={{ fontSize: 12, color: "#94a3b8" }}>
                    {t.workDate}
                  </td>
                  <td>
                    <span className="code-pill">{t.hoursLogged}h</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.project || "—"}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>
                    {t.task || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>
                      ● {t.status}
                    </span>
                  </td>
                  <td>
                    {t.status === "SUBMITTED" && (
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(t.id)}
                        >
                          <MdCheck size={12} /> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(t.id)}
                        >
                          <MdClose size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdAssignment />
                      </div>
                      <div className="empty-title">No timesheets found</div>
                      <div className="empty-sub">
                        Click "Log Time" to add an entry
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

export default Timesheets;
