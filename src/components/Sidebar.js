import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdAccessTime,
  MdEventNote,
  MdAssignment,
  MdTimeline,
  MdBarChart,
  MdSettings,
} from "react-icons/md";

const menuItems = [
  { path: "/", icon: <MdDashboard size={22} />, label: "Home" },
  { path: "/employees", icon: <MdPeople size={22} />, label: "Staff" },
  { path: "/attendance", icon: <MdAccessTime size={22} />, label: "Time" },
  { path: "/leave", icon: <MdEventNote size={22} />, label: "Leave" },
  { path: "/timesheets", icon: <MdAssignment size={22} />, label: "Sheet" },
  { path: "/career", icon: <MdTimeline size={22} />, label: "Career" },
  { path: "/reports", icon: <MdBarChart size={22} />, label: "Reports" },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">H</div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      <div className="sidebar-spacer" />
      <Link to="/settings" className="sidebar-item">
        <MdSettings size={22} /> Settings
      </Link>
    </div>
  );
};

export default Sidebar;
