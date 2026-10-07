import { useState } from "react";
import {
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  LogIn,
} from "lucide-react";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function StudentLogin({ onRegister })  {
  const { login } = useStudentAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      login(form.email, form.password);
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
          <h1>Student Login</h1>
          <p>Sign in to access campus events.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>

          <label>
            Email

            <div className="password-field">
              <Mail size={16} />

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your student email"
                required
              />
            </div>
          </label>

          <label>
            Password

            <div className="password-field">
              <LockKeyhole size={16} />

              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your password"
                required
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
            <LogIn size={17} />

            {loading
              ? "Signing in..."
              : "Student Sign In"}
          </button>

          <p className="auth-hint">
            Only registered student accounts can access
            the Student Portal.
          </p>
          <p className="auth-switch">
  Don't have an account?{" "}
  <button type="button" onClick={onRegister}>
    Sign Up
  </button>
</p>

        </form>
      </div>
    </div>
  );
}