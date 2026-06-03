import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Employee APIs ──────────────────────────────
export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  getActive: () => api.get("/employees/active"),
  getByDepartment: (deptId) => api.get(`/employees/department/${deptId}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  deactivate: (id) => api.patch(`/employees/${id}/deactivate`),
  activate: (id) => api.patch(`/employees/${id}/activate`),
  getDepartments: () => api.get("/employees/meta/departments"),
  getDesignations: () => api.get("/employees/meta/designations"),
  getDesignationsByDept: (deptId) =>
    api.get(`/employees/meta/designations/${deptId}`),
};

// ── Attendance APIs ────────────────────────────
export const attendanceAPI = {
  getByEmployee: (id) => api.get(`/attendance/employee/${id}`),
  getToday: (id) => api.get(`/attendance/employee/${id}/today`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  countPresentToday: () => api.get("/attendance/count/present-today"),
  checkIn: (id) => api.post(`/attendance/checkin/${id}`),
  checkOut: (id) => api.put(`/attendance/checkout/${id}`),
};

// ── Leave APIs ─────────────────────────────────
export const leaveAPI = {
  getAll: () => api.get("/leave"),
  getByEmployee: (id) => api.get(`/leave/employee/${id}`),
  getPending: () => api.get("/leave/pending"),
  countPending: () => api.get("/leave/count/pending"),
  getTypes: () => api.get("/leave/types"),
  apply: (data) => api.post("/leave/apply", data),
  approve: (id, approverId) =>
    api.put(`/leave/${id}/approve`, { approverId: Number(approverId) }),
  reject: (id, approverId, note) =>
    api.put(`/leave/${id}/reject`, {
      approverId: String(Number(approverId)),
      note,
    }),
  cancel: (id) => api.put(`/leave/${id}/cancel`),
};

// ── Timesheet APIs ─────────────────────────────
export const timesheetAPI = {
  getByEmployee: (id) => api.get(`/timesheets/employee/${id}`),
  getPending: () => api.get("/timesheets/pending"),
  create: (data) => api.post("/timesheets", data),
  submit: (id) => api.put(`/timesheets/${id}/submit`),
  approve: (id, approverId) =>
    api.put(`/timesheets/${id}/approve`, { approverId: Number(approverId) }),
  reject: (id) => api.put(`/timesheets/${id}/reject`),
};

// ── Career History APIs ────────────────────────
export const careerHistoryAPI = {
  getByEmployee: (id) => api.get(`/career-history/employee/${id}`),
  add: (empId, data) => api.post(`/career-history/employee/${empId}`, data),
};

// ── Dashboard API ──────────────────────────────
export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

// ── Announcement APIs ──────────────────────────
export const announcementAPI = {
  getActive: () => api.get("/announcements"),
  getAll: () => api.get("/announcements/all"),
  create: (data) => api.post("/announcements", data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export default api;
