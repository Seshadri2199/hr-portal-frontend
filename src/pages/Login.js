import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employeeCode: "",
    role: "EMPLOYEE",
    dateOfJoining: "",
  });

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setError("Please enter both username and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        loginForm,
      );
      if (res.data.success) {
        localStorage.setItem("hrportal_user", JSON.stringify(res.data));
        onLogin();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !registerForm.username ||
      !registerForm.password ||
      !registerForm.firstName ||
      !registerForm.email ||
      !registerForm.employeeCode
    ) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        registerForm,
      );
      if (res.data.success) {
        setSuccess("Account created successfully! You can now sign in.");
        setMode("login");
        setLoginForm({ username: registerForm.username, password: "" });
        setRegisterForm({
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          employeeCode: "",
          role: "EMPLOYEE",
          dateOfJoining: "",
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
    },
    left: {
      flex: 1,
      background: "#1e293b",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "60px 56px",
      position: "relative",
      overflow: "hidden",
    },
    right: {
      width: "480px",
      flexShrink: 0,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "48px 48px",
      overflowY: "auto",
    },
    input: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "14px",
      color: "#0f172a",
      outline: "none",
      fontFamily: "inherit",
      background: "#f8fafc",
      transition: "all 150ms",
      boxSizing: "border-box",
    },
    label: {
      display: "block",
      fontSize: "12px",
      fontWeight: "600",
      color: "#475569",
      marginBottom: "6px",
      letterSpacing: "0.1px",
    },
    btn: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "#334155",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 150ms",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      letterSpacing: "0.2px",
    },
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#334155";
    e.target.style.background = "#fff";
    e.target.style.boxShadow = "0 0 0 3px rgba(51,65,85,0.1)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={styles.page}>
      {/* ── Left Panel ── */}
      <div style={styles.left}>
        {/* Background circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 48 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                color: "#334155",
                fontWeight: 900,
                fontSize: 22,
                fontFamily: '"Plus Jakarta Sans","Inter",sans-serif',
              }}
            >
              T
            </span>
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              fontFamily: '"Plus Jakarta Sans","Inter",sans-serif',
              letterSpacing: "-0.8px",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            TECHNEXT
            <br />
            <span style={{ color: "#94a3b8" }}>HR Portal</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              fontWeight: 500,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            Staffing Management System
          </div>
        </div>

        {/* Features */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {[
            {
              icon: "👥",
              title: "Employee Management",
              desc: "Manage your entire workforce in one place",
            },
            {
              icon: "📅",
              title: "Leave & Attendance",
              desc: "Track attendance and approve leaves easily",
            },
            {
              icon: "📊",
              title: "Reports & Analytics",
              desc: "Insights and data exports at your fingertips",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e2e8f0",
                    marginBottom: 2,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "auto",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>
            © 2026 TECHNEXT HR Portal · All rights reserved
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={styles.right}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              fontFamily: '"Plus Jakarta Sans","Inter",sans-serif',
              letterSpacing: "-0.5px",
              marginBottom: 6,
            }}
          >
            {mode === "login" ? "Welcome back" : "Create account"}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
            {mode === "login"
              ? "Sign in to access your HR dashboard"
              : "Register to get access to the portal"}
          </div>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "flex",
            gap: 3,
            background: "#f1f5f9",
            padding: 3,
            borderRadius: 10,
            marginBottom: 28,
          }}
        >
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMode(tab);
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                transition: "all 150ms",
                background: mode === tab ? "#fff" : "transparent",
                color: mode === tab ? "#0f172a" : "#94a3b8",
                boxShadow: mode === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecdd3",
              borderRadius: 10,
              padding: "11px 14px",
              marginBottom: 18,
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
        {success && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 10,
              padding: "11px 14px",
              marginBottom: 18,
              color: "#166534",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#94a3b8",
                    padding: 0,
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </span>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#334155";
              }}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Demo credentials */}
            <div
              style={{
                marginTop: 24,
                padding: "14px 16px",
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 6,
                }}
              >
                Demo Credentials
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <span>
                  Username: <strong style={{ color: "#334155" }}>admin</strong>
                </span>
                <span>
                  Password:{" "}
                  <strong style={{ color: "#334155" }}>admin123</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 13,
              }}
            >
              <div>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={registerForm.firstName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      firstName: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={registerForm.lastName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      lastName: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Employee Code *</label>
                <input
                  type="text"
                  placeholder="e.g. ZY001"
                  value={registerForm.employeeCode}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      employeeCode: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9999999999"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, phone: e.target.value })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Date of Joining</label>
                <input
                  type="date"
                  value={registerForm.dateOfJoining}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      dateOfJoining: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Username *</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      username: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Role</label>
                <select
                  value={registerForm.role}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, role: e.target.value })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={styles.input}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="HR_STAFF">HR Staff</option>
                  <option value="HR_MANAGER">HR Manager</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={styles.label}>Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#94a3b8",
                    padding: 0,
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#334155";
              }}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #cbd5e1 !important; }

        @media (max-width: 768px) {
          .login-page { flex-direction: column !important; }
          .login-left { display: none !important; }
          .login-right {
            width: 100% !important;
            padding: 32px 24px !important;
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
