import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminPortal from "./portals/AdminPortal";
import HRManagerPortal from "./portals/HRManagerPortal";
import HRStaffPortal from "./portals/HRStaffPortal";
import ManagerPortal from "./portals/ManagerPortal";
import EmployeePortal from "./portals/EmployeePortal";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("hrportal_user"),
  );

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("hrportal_user");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  const user = JSON.parse(localStorage.getItem("hrportal_user") || "{}");
  const role = user.role;

  return (
    <Router>
      <Routes>
        {role === "ADMIN" && (
          <Route
            path="/*"
            element={<AdminPortal user={user} onLogout={handleLogout} />}
          />
        )}
        {role === "HR_MANAGER" && (
          <Route
            path="/*"
            element={<HRManagerPortal user={user} onLogout={handleLogout} />}
          />
        )}
        {role === "HR_STAFF" && (
          <Route
            path="/*"
            element={<HRStaffPortal user={user} onLogout={handleLogout} />}
          />
        )}
        {role === "MANAGER" && (
          <Route
            path="/*"
            element={<ManagerPortal user={user} onLogout={handleLogout} />}
          />
        )}
        {role === "EMPLOYEE" && (
          <Route
            path="/*"
            element={<EmployeePortal user={user} onLogout={handleLogout} />}
          />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
