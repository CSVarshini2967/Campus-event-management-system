import { useState } from "react";
import { CalendarDays, UserRound, Mail, LockKeyhole, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register({ onLogin }) {
  const { register } = useAuth();
  const [form,setForm]=useState({name:"",email:"",password:"",department:"CSE"});
  const [error,setError]=useState("");
  function submit(e){e.preventDefault();setError("");if(form.password.length<6){setError("Password must contain at least 6 characters");return;}try{register(form);window.history.replaceState({},"","/")}catch(err){setError(err.message)}}
  return <div className="auth-page"><div className="auth-card"><div className="auth-brand"><div className="brand-icon"><CalendarDays size={20}/></div><div><b>Campus Events</b><span>Management System</span></div></div><div className="auth-heading"><h1>Create account</h1><p>Register for the campus event system.</p></div><form className="auth-form" onSubmit={submit}><label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@college.edu" required/></label><label>Department<select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option>CSE</option><option>ECE</option><option>EEE</option><option>ME</option><option>Civil</option></select></label><label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters" required/></label>{error&&<div className="auth-error">{error}</div>}<button className="auth-submit"><UserPlus size={17}/>Create Account</button><p className="auth-switch">Already have an account? <button type="button" onClick={onLogin}>Sign in</button></p></form></div></div>;
}
