import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  GraduationCap,
  Award
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "CSE",
    roll_no: "",
    year: "3"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.role === "student" && !form.roll_no.trim()) {
      setError("Roll Number is required for student registration.");
      return;
    }

    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "460px" }}>
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
          <h1>Create Account</h1>
          <p>Register as a student or club organiser</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Role selector buttons */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ marginBottom: "6px", display: "block" }}>I am registering as</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className={`role-select-btn ${form.role === "student" ? "selected" : ""}`}
                onClick={() => setForm({ ...form, role: "student" })}
              >
                <GraduationCap size={18} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`role-select-btn ${form.role === "organiser" ? "selected" : ""}`}
                onClick={() => setForm({ ...form, role: "organiser" })}
              >
                <Award size={18} />
                <span>Club Organiser</span>
              </button>
            </div>
          </div>

          <label>
            Full Name
            <div className="password-field">
              <UserRound size={16} />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sreevarshini"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label>
            College Email
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <label>
              Department
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                disabled={loading}
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="Civil">Civil</option>
                <option value="IT">IT</option>
                <option value="AIDS">AI & DS</option>
              </select>
            </label>

            {form.role === "student" ? (
              <label>
                Year of Study
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  disabled={loading}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </label>
            ) : (
              <label>
                Role Type
                <input type="text" value="Event Coordinator" disabled />
              </label>
            )}
          </div>

          {form.role === "student" && (
            <label>
              Roll Number
              <input
                type="text"
                value={form.roll_no}
                onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
                placeholder="e.g. 23CSE041"
                required
                disabled={loading}
              />
            </label>
          )}

          <label>
            Password
            <div className="password-field">
              <LockKeyhole size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
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
            <UserPlus size={18} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
