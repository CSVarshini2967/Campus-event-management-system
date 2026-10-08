import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Eye, EyeOff, LockKeyhole, Mail, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      if (loggedInUser.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">
            <CalendarDays size={22} />
          </div>
          <div>
            <strong>Campus Events</strong>
            <span>Management System</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to manage and participate in campus events</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <div className="password-field">
              <Mail size={16} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@college.edu"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label>
            Password
            <div className="password-field">
              <LockKeyhole size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>

          <div className="auth-hint" style={{ marginTop: "12px" }}>
            <span style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>
              Quick Login Demo:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickFill("admin@campusevents.com", "password123")}
              >
                Admin
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickFill("organiser@campusevents.com", "password123")}
              >
                Organiser
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleQuickFill("sreevarshini@college.edu", "password123")}
              >
                Student
              </button>
            </div>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
