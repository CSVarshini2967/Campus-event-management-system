import { useState } from "react";
import { CalendarDays, Eye, EyeOff, LockKeyhole, Mail, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login({ onRegister }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "admin@campusevents.com", password: "admin123" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { login(form.email, form.password); window.history.replaceState({}, "", "/"); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in to manage campus events.">
    <form className="auth-form" onSubmit={submit}>
      <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="admin@campusevents.com" required/></label>
      <label>Password<div className="password-field"><LockKeyhole size={16}/><input type={show?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password" required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>
      {error && <div className="auth-error">{error}</div>}
      <button className="auth-submit" disabled={loading}><LogIn size={17}/>{loading ? "Signing in..." : "Sign In"}</button>
      <p className="auth-hint">Demo admin: <b>admin@campusevents.com</b> / <b>admin123</b></p>
      <p className="auth-switch">Don't have an account? <button type="button" onClick={onRegister}>Create account</button></p>
    </form>
  </AuthLayout>;
}

function AuthLayout({title,subtitle,children}) { return <div className="auth-page"><div className="auth-card"><div className="auth-brand"><div className="brand-icon"><CalendarDays size={20}/></div><div><b>Campus Events</b><span>Management System</span></div></div><div className="auth-heading"><h1>{title}</h1><p>{subtitle}</p></div>{children}</div></div>; }
