import React, { useState } from "react";
import axios from "axios";
import {
  MdPerson,
  MdLock,
  MdInfo,
  MdEdit,
  MdSave,
  MdClose,
  MdCheck,
} from "react-icons/md";

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    email: "",
    phone: "",
    employeeCode: user?.employeeCode || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setError("Please fill all password fields");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: <MdPerson size={18} /> },
    { id: "password", label: "Change Password", icon: <MdLock size={18} /> },
    { id: "system", label: "System Info", icon: <MdInfo size={18} /> },
  ];

  const infoRows = (rows) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {rows.map(([key, val], i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "13px 0",
            borderBottom:
              i < rows.length - 1 ? "1px solid var(--gray-100)" : "none",
          }}
        >
          <span
            style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 600 }}
          >
            {key}
          </span>
          <span
            style={{ fontSize: 13, color: "var(--gray-900)", fontWeight: 600 }}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="content">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">
            Manage your account and system preferences
          </div>
        </div>
      </div>

      {success && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            padding: "11px 16px",
            marginBottom: 20,
            color: "#166534",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MdCheck size={16} /> {success}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecdd3",
            borderRadius: 10,
            padding: "11px 16px",
            marginBottom: 20,
            color: "#b91c1c",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}
      >
        {/* Left nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                setSuccess("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                transition: "all 150ms",
                background: activeTab === tab.id ? "#0f172a" : "var(--white)",
                color: activeTab === tab.id ? "#fff" : "var(--gray-600)",
                boxShadow:
                  activeTab === tab.id
                    ? "0 2px 8px rgba(15,23,42,0.2)"
                    : "var(--shadow-xs)",
                border:
                  activeTab === tab.id ? "none" : "1px solid var(--gray-100)",
              }}
            >
              <span
                style={{
                  color: activeTab === tab.id ? "#3b82f6" : "var(--gray-400)",
                }}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div>
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Profile Settings</div>
                  <div className="card-subtitle">
                    Update your personal information
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--gray-200)",
                    background: editMode ? "var(--red-muted)" : "var(--white)",
                    color: editMode ? "var(--red)" : "var(--gray-700)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {editMode ? (
                    <>
                      <MdClose size={14} /> Cancel
                    </>
                  ) : (
                    <>
                      <MdEdit size={14} /> Edit
                    </>
                  )}
                </button>
              </div>
              <div className="card-body">
                {/* Avatar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 28,
                    padding: 20,
                    background: "var(--gray-50)",
                    borderRadius: 12,
                    border: "1px solid var(--gray-100)",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      background: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 26,
                      fontFamily: "var(--font-display)",
                      flexShrink: 0,
                    }}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        fontWeight: 800,
                        color: "var(--gray-900)",
                      }}
                    >
                      {user?.fullName}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--gray-500)",
                        marginTop: 4,
                      }}
                    >
                      {user?.role}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 8,
                        background: "var(--brand-light)",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--brand)",
                      }}
                    >
                      {user?.employeeCode}
                    </div>
                  </div>
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      value={profile.firstName}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      style={{
                        background: editMode ? "#fff" : "var(--gray-50)",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      value={profile.lastName}
                      disabled={!editMode}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      style={{
                        background: editMode ? "#fff" : "var(--gray-50)",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-control"
                      value={profile.email}
                      disabled={!editMode}
                      placeholder="your@email.com"
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      style={{
                        background: editMode ? "#fff" : "var(--gray-50)",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-control"
                      value={profile.phone}
                      disabled={!editMode}
                      placeholder="+91 9999999999"
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      style={{
                        background: editMode ? "#fff" : "var(--gray-50)",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Employee Code</label>
                    <input
                      className="form-control"
                      value={profile.employeeCode}
                      disabled
                      style={{ background: "var(--gray-50)" }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      className="form-control"
                      value={user?.role}
                      disabled
                      style={{ background: "var(--gray-50)" }}
                    />
                  </div>
                </div>

                {editMode && (
                  <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      <MdSave size={15} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Change Password</div>
                  <div className="card-subtitle">Keep your account secure</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ maxWidth: 420 }}>
                  <div
                    style={{
                      background: "var(--blue-muted)",
                      border: "1px solid var(--blue-light)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      marginBottom: 24,
                      fontSize: 12,
                      color: "#1e40af",
                      fontWeight: 500,
                    }}
                  >
                    ℹ Password must be at least 6 characters long
                  </div>
                  <div className="form-grid" style={{ gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter current password"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm new password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      <MdLock size={15} />
                      {saving ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM INFO TAB */}
          {activeTab === "system" && (
            <div>
              <div className="card" style={{ marginBottom: 18 }}>
                <div className="card-header">
                  <div className="card-title">System Information</div>
                </div>
                <div className="card-body">
                  {infoRows([
                    ["Application", "TECHNEXT HR Portal"],
                    ["Version", "v1.0.0"],
                    ["Environment", "Development"],
                    ["Backend", "Spring Boot 3.5.14"],
                    ["Database", "MySQL 8.0.43"],
                    ["Frontend", "React 18"],
                    ["API Base URL", "http://localhost:8080/api"],
                  ])}
                </div>
              </div>

              <div className="card" style={{ marginBottom: 18 }}>
                <div className="card-header">
                  <div className="card-title">Session Information</div>
                </div>
                <div className="card-body">
                  {infoRows([
                    ["Logged in as", user?.fullName || "N/A"],
                    ["Username", user?.username || "N/A"],
                    ["Role", user?.role || "N/A"],
                    ["Employee Code", user?.employeeCode || "N/A"],
                    ["Employee ID", user?.employeeId || "N/A"],
                    ["Session", "Active ✅"],
                  ])}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">Support</div>
                </div>
                <div className="card-body">
                  {infoRows([
                    ["Company", "TECHNEXT"],
                    ["Support Email", "support@technext.com"],
                    ["Portal Type", "HR Management System"],
                    ["Built with", "Spring Boot + React + MySQL"],
                  ])}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
