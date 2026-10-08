import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Home,
  LogOut,
  Bell,
  Search,
  Clock3,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star
} from "lucide-react";
import { registrationService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function MyEvents({ onNavigate }) {
  const { user, logout } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMyRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data || []);
    } catch (err) {
      console.error("Failed to load my events:", err);
      showToast("Could not load your registered events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyRegistrations();
  }, []);

  const handleCancel = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${title}"?`)) {
      return;
    }

    try {
      await registrationService.cancel(eventId);
      showToast("Registration cancelled successfully.");
      loadMyRegistrations();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel registration.", "error");
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    return timeStr.slice(0, 5);
  };

  const activeRegistrations = registrations.filter((r) => r.registration_status === "registered");

  return (
    <div className="app-shell student-app">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <CalendarDays size={20} />
          </div>
          <div>
            <strong>Campus Events</strong>
            <span>Student Portal</span>
          </div>
        </div>

        <nav>
          <button className="side-link" onClick={() => onNavigate("dashboard")}>
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button className="side-link" onClick={() => onNavigate("events")}>
            <CalendarDays size={18} />
            <span>Events</span>
          </button>

          <button className="side-link active" onClick={() => onNavigate("my-events")}>
            <ClipboardList size={18} />
            <span>My Events</span>
          </button>

          <button className="side-link" onClick={() => onNavigate("feedback")}>
            <MessageSquare size={18} />
            <span>Feedback</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="side-link logout" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="topbar">
        <div className="brand-mobile">
          <div className="brand-icon">
            <CalendarDays size={17} />
          </div>
          <strong>Campus Events</strong>
        </div>

        <div className="search-wrap">
          <Search size={17} />
          <input type="text" placeholder="Search my registered events..." />
        </div>

        <div className="top-actions">
          <div className="profile">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="profile-copy">
              <b>{user?.name || "Student"}</b>
              <span>{user?.roll_no ? `${user.roll_no} • ` : ""}{user?.department || "Student"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="page-header">
          <div>
            <h1>My Registered Events</h1>
            <p>Track your registrations, verify your attendance records, and submit reviews.</p>
          </div>

          <button className="primary-btn" onClick={() => onNavigate("events")}>
            <CalendarDays size={16} />
            Browse More Events
          </button>
        </div>

        <section className="content-card">
          <div className="card-head">
            <div>
              <h2>Active Registrations ({activeRegistrations.length})</h2>
              <p>Your upcoming events schedule and participation records.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              Loading your registered events...
            </div>
          ) : activeRegistrations.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              <p style={{ marginBottom: "16px" }}>You have not registered for any events yet.</p>
              <button className="primary-btn" onClick={() => onNavigate("events")}>
                Explore Campus Events
              </button>
            </div>
          ) : (
            <div className="event-list student-event-list">
              {activeRegistrations.map((reg) => (
                <div className="event-row" key={reg.registration_id}>
                  <div className={`event-date ${reg.category?.toLowerCase() || "technical"}`}>
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <div className="event-title-line">
                      <h3>{reg.title}</h3>
                      <span className="tag">{reg.category}</span>
                      {reg.club_name && <span className="chip-sm">{reg.club_name}</span>}
                    </div>

                    <div className="meta-row">
                      <span>
                        <Clock3 size={13} />
                        {reg.event_date} ({formatTime(reg.start_time)} - {formatTime(reg.end_time)})
                      </span>

                      <span>
                        <MapPin size={13} />
                        {reg.venue_name || "TBA"}
                      </span>

                      <span>
                        Registered on: {new Date(reg.registered_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Attendance status badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    {reg.attendance_status === "present" ? (
                      <span className="badge badge-success" title="Marked present by coordinator">
                        <CheckCircle2 size={13} style={{ marginRight: "4px" }} />
                        Present
                      </span>
                    ) : reg.event_status === "completed" ? (
                      <span className="badge badge-neutral">Absent</span>
                    ) : (
                      <span className="badge badge-warning">Upcoming</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="row-actions" style={{ gap: "8px" }}>
                    {reg.feedback_rating ? (
                      <span className="chip-sm" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        Rated {reg.feedback_rating}/5
                      </span>
                    ) : (
                      <button
                        className="btn-sm"
                        style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)" }}
                        onClick={() => onNavigate("feedback", reg.event_id)}
                      >
                        Feedback
                      </button>
                    )}

                    {reg.event_status !== "completed" && (
                      <button
                        className="btn-sm danger"
                        onClick={() => handleCancel(reg.event_id, reg.title)}
                        title="Cancel Registration"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      className="icon-btn"
                      onClick={() => onNavigate("event-details", reg.event_id)}
                      title="View Details"
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyEvents;