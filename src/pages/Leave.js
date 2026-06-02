import React, { useState, useEffect } from "react";
import { leaveAPI, employeeAPI } from "../services/api";
import { MdEventNote, MdAdd, MdCheck, MdClose } from "react-icons/md";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [form, setForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    totalDays: 1,
    reason: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [leavesRes, typesRes, empRes] = await Promise.all([
        leaveAPI.getAll(),
        leaveAPI.getTypes(),
        employeeAPI.getActive(),
      ]);
      setLeaves(leavesRes.data);
      setLeaveTypes(typesRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.employeeId ||
      !form.leaveTypeId ||
      !form.fromDate ||
      !form.toDate
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await leaveAPI.apply({
        employee: { id: form.employeeId },
        leaveType: { id: form.leaveTypeId },
        fromDate: form.fromDate,
        toDate: form.toDate,
        totalDays: form.totalDays,
        reason: form.reason,
      });
      setShowForm(false);
      setForm({
        employeeId: "",
        leaveTypeId: "",
        fromDate: "",
        toDate: "",
        totalDays: 1,
        reason: "",
      });
      loadAll();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveAPI.approve(id, 1);
      loadAll();
    } catch (err) {
      alert("Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveAPI.reject(id, 1, "Rejected by manager");
      loadAll();
    } catch (err) {
      alert("Error rejecting");
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const tabs = ["ALL", "PENDING", "APPROVED", "REJECTED"];
  const filtered =
    activeTab === "ALL" ? leaves : leaves.filter((l) => l.status === activeTab);

  if (loading)
    return (
      <div className="loading">
        <MdEventNote size={28} />
        Loading leave requests...
      </div>
    );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Leave Management</div>
          <div className="page-subtitle">
            {leaves.length} total · {pendingCount} pending
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div className="card-title">New Leave Application</div>
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
                <label className="form-label">Leave Type *</label>
                <select
                  className="form-control"
                  value={form.leaveTypeId}
                  onChange={(e) =>
                    setForm({ ...form, leaveTypeId: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  {leaveTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Days</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={form.totalDays}
                  onChange={(e) =>
                    setForm({ ...form, totalDays: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">From Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.fromDate}
                  onChange={(e) =>
                    setForm({ ...form, fromDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">To Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.toDate}
                  onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reason for leave"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
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
            <div className="card-title">Leave Requests</div>
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
                {tab === "PENDING" && pendingCount > 0 && (
                  <span
                    style={{
                      background: "#d97706",
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
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
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
                  <td
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.reason || "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${l.status?.toLowerCase()}`}>
                      ● {l.status}
                    </span>
                  </td>
                  <td>
                    {l.status === "PENDING" && (
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(l.id)}
                        >
                          <MdCheck size={12} /> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(l.id)}
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
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <MdEventNote />
                      </div>
                      <div className="empty-title">No leave requests</div>
                      <div className="empty-sub">
                        Click "Apply Leave" to submit a request
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

export default Leave;
