import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { employeeAPI } from "../services/api";
import { MdSearch, MdPeople, MdAdd, MdClose } from "react-icons/md";

const avatarColors = [
  "avatar-blue",
  "avatar-green",
  "avatar-orange",
  "avatar-purple",
  "avatar-red",
  "avatar-teal",
];

const emptyForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employmentType: "FULL_TIME",
  dateOfJoining: "",
  gender: "MALE",
  departmentId: "",
  designationId: "",
  address: "",
};

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allDesignations, setAllDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadMeta();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data);
      setAllEmployees(res.data);
    } catch (err) {
      console.error("loadEmployees error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        employeeAPI.getDepartments(),
        employeeAPI.getDesignations(),
      ]);
      setDepartments(deptRes.data);
      setAllDesignations(desigRes.data);
      setFilteredDesignations(desigRes.data);
    } catch (err) {
      console.error("loadMeta error:", err);
    } finally {
      setMetaLoading(false);
    }
  };

  const handleDeptChange = (deptId) => {
    setForm((prev) => ({ ...prev, departmentId: deptId, designationId: "" }));
    if (deptId) {
      const filtered = allDesignations.filter(
        (d) => d.department && String(d.department.id) === String(deptId),
      );
      setFilteredDesignations(filtered);
    } else {
      setFilteredDesignations(allDesignations);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(e.target.value);
    if (!val) {
      setEmployees(allEmployees);
    } else {
      setEmployees(
        allEmployees.filter(
          (emp) =>
            emp.firstName?.toLowerCase().includes(val) ||
            emp.lastName?.toLowerCase().includes(val) ||
            emp.email?.toLowerCase().includes(val) ||
            emp.employeeCode?.toLowerCase().includes(val),
        ),
      );
    }
  };

  const handleSubmit = async () => {
    if (
      !form.employeeCode ||
      !form.firstName ||
      !form.email ||
      !form.dateOfJoining
    ) {
      alert("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await employeeAPI.create({
        ...form,
        departmentId: form.departmentId ? parseInt(form.departmentId) : null,
        designationId: form.designationId ? parseInt(form.designationId) : null,
      });
      setShowForm(false);
      setForm(emptyForm);
      setFilteredDesignations(allDesignations);
      loadEmployees();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (f, l) =>
    `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

  if (loading)
    return (
      <div className="loading">
        <MdPeople size={28} />
        Loading employees...
      </div>
    );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">
            {employees.length} total employees
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setForm(emptyForm);
            setFilteredDesignations(allDesignations);
          }}
        >
          {showForm ? <MdClose size={16} /> : <MdAdd size={16} />}
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="card-header">
            <div>
              <div className="card-title">New Employee</div>
              <div className="card-subtitle">
                {metaLoading
                  ? "Loading departments..."
                  : `${departments.length} departments available`}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label className="form-label">Employee Code *</label>
                <input
                  className="form-control"
                  placeholder="e.g. TN002"
                  value={form.employeeCode}
                  onChange={(e) =>
                    setForm({ ...form, employeeCode: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  className="form-control"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="email@technext.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-control"
                  placeholder="+91 9999999999"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining *</label>
                <input
                  className="form-control"
                  type="date"
                  value={form.dateOfJoining}
                  onChange={(e) =>
                    setForm({ ...form, dateOfJoining: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Department{" "}
                  {metaLoading && (
                    <span style={{ color: "#94a3b8" }}>(loading...)</span>
                  )}
                </label>
                <select
                  className="form-control"
                  value={form.departmentId}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  disabled={metaLoading}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Designation{" "}
                  {metaLoading && (
                    <span style={{ color: "#94a3b8" }}>(loading...)</span>
                  )}
                </label>
                <select
                  className="form-control"
                  value={form.designationId}
                  onChange={(e) =>
                    setForm({ ...form, designationId: e.target.value })
                  }
                  disabled={metaLoading}
                >
                  <option value="">Select Designation</option>
                  {filteredDesignations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.grade})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select
                  className="form-control"
                  value={form.employmentType}
                  onChange={(e) =>
                    setForm({ ...form, employmentType: e.target.value })
                  }
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMP">Temporary</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  placeholder="Full address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Employee"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
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
            <div className="card-title">All Employees</div>
            <div className="card-subtitle">{employees.length} records</div>
          </div>
          <div className="search-wrap">
            <MdSearch size={16} />
            <input
              type="text"
              placeholder="Search by name, email, code..."
              value={search}
              onChange={handleSearch}
            />
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
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
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
                            color: "#334155",
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
                    {emp.departmentName || "—"}
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {emp.designationTitle || "—"}
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
                      <div className="empty-title">No employees found</div>
                      <div className="empty-sub">
                        Click "Add Employee" to get started
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

export default Employees;
