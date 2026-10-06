import { useState } from "react";
import {
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function StudentRegister({ onLogin }) {
  const { register } = useStudentAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "CSE",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="brand-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <b>Campus Events</b>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Create Student Account</h1>
          <p>Register to participate in campus events.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>

          <label>
            Full Name

            <div className="password-field">
              <User size={16} />

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
                placeholder="Enter your full name"
                required
              />
            </div>
          </label>

          <label>
            Email

            <div className="password-field">
              <Mail size={16} />

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </div>
          </label>

          <label>
            Department

            <select
              value={form.department}
              onChange={(e) =>
                update("department", e.target.value)
              }
              required
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="AI & DS">AI & DS</option>
            </select>
          </label>

          <label>
            Password

            <div className="password-field">
              <LockKeyhole size={16} />

              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  update("password", e.target.value)
                }
                placeholder="Create a password"
                required
                minLength={6}
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            disabled={loading}
          >
            <UserPlus size={17} />

            {loading
              ? "Creating account..."
              : "Create Student Account"}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" onClick={onLogin}>
              Sign in
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}