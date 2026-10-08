import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Home,
  LogOut,
  Clock3,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck
} from "lucide-react";
import { eventService, registrationService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function EventDetails({ eventId, onNavigate }) {
  const { user, logout } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadEvent = async () => {
    if (!eventId) {
      onNavigate("events");
      return;
    }
    try {
      setLoading(true);
      const data = await eventService.getById(eventId);
      setEvent(data);
    } catch (err) {
      console.error("Failed to load event:", err);
      showToast("Could not load event details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      setActionLoading(true);
      await registrationService.register(eventId);
      showToast("Successfully registered for this event!");
      loadEvent();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;
    try {
      setActionLoading(true);
      await registrationService.cancel(eventId);
      showToast("Registration cancelled.");
      loadEvent();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel registration.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    return timeStr.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="app-shell student-app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><CalendarDays size={20} /></div>
            <div><strong>Campus Events</strong><span>Student Portal</span></div>
          </div>
        </aside>
        <main className="main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading event details...</p>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="app-shell student-app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><CalendarDays size={20} /></div>
            <div><strong>Campus Events</strong><span>Student Portal</span></div>
          </div>
        </aside>
        <main className="main">
          <button className="text-btn" onClick={() => onNavigate("events")}>
            <ArrowLeft size={16} /> Back to Events
          </button>
          <p style={{ marginTop: "24px", color: "var(--text-muted)" }}>Event not found.</p>
        </main>
      </div>
    );
  }

  const isRegistered = event.isUserRegistered;
  const isFull = event.capacity && event.total_registrations >= event.capacity;

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
          <button className="side-link active" onClick={() => onNavigate("events")}>
            <CalendarDays size={18} />
            <span>Events</span>
          </button>
          <button className="side-link" onClick={() => onNavigate("my-events")}>
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

      {/* Main Content */}
      <main className="main">
        <div style={{ marginBottom: "16px" }}>
          <button className="text-btn" onClick={() => onNavigate("events")}>
            <ArrowLeft size={16} /> Back to Events
          </button>
        </div>

        <div className="page-header">
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              <span className="tag">{event.category}</span>
              <span className={`badge ${event.status === "completed" ? "badge-neutral" : "badge-success"}`}>
                {event.status}
              </span>
            </div>
            <h1>{event.title}</h1>
            <p>Organized by <b>{event.club_name || "Campus Committee"}</b></p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {isRegistered ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="badge badge-success" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  <CheckCircle2 size={16} style={{ marginRight: "4px" }} />
                  Registered
                </span>
                {event.status !== "completed" && (
                  <button className="btn-sm danger" onClick={handleCancel} disabled={actionLoading}>
                    Cancel Registration
                  </button>
                )}
              </div>
            ) : isFull ? (
              <span className="badge badge-warning" style={{ padding: "8px 14px" }}>
                Event is Full
              </span>
            ) : event.status === "completed" ? (
              <span className="badge badge-neutral" style={{ padding: "8px 14px" }}>
                Event Completed
              </span>
            ) : (
              <button className="primary-btn" onClick={handleRegister} disabled={actionLoading}>
                <CheckCircle2 size={16} />
                Register Now
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          <div className="content-card">
            <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>About the Event</h2>
            <p style={{ lineHeight: "1.7", color: "var(--text-secondary)", marginBottom: "20px" }}>
              {event.description || "No description provided for this event."}
            </p>

            {event.club_description && (
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Building2 size={15} /> {event.club_name}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{event.club_description}</p>
              </div>
            )}
          </div>

          <div className="content-card">
            <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Event Schedule & Venue</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CalendarDays size={18} color="#38bdf8" />
                <div>
                  <b style={{ display: "block", fontSize: "14px" }}>Date</b>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{event.event_date}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Clock3 size={18} color="#38bdf8" />
                <div>
                  <b style={{ display: "block", fontSize: "14px" }}>Timing</b>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <MapPin size={18} color="#38bdf8" />
                <div>
                  <b style={{ display: "block", fontSize: "14px" }}>Venue</b>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {event.venue_name || "TBA"} ({event.venue_location || "Campus"})
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Users size={18} color="#38bdf8" />
                <div>
                  <b style={{ display: "block", fontSize: "14px" }}>Registration Capacity</b>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {event.total_registrations || 0} / {event.capacity || 100} Registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventDetails;