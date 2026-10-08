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
  Users,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { eventService, registrationService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Events({ onNavigate }) {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [eventsData, myRegData] = await Promise.all([
        eventService.getAll({
          search: search || undefined,
          category: category !== "All" ? category : undefined
        }),
        registrationService.getMyRegistrations().catch(() => [])
      ]);
      setEvents(eventsData || []);
      setMyRegistrations(myRegData || []);
    } catch (err) {
      console.error("Failed to load events:", err);
      showToast("Failed to load events list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  const handleRegister = async (eventId) => {
    try {
      await registrationService.register(eventId);
      showToast("Successfully registered for the event!");
      loadEvents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register for event.", "error");
    }
  };

  const categories = ["All", "Technical", "Cultural", "Sports", "Academic"];

  const formatTime = (timeStr) => {
    if (!timeStr) return "TBA";
    return timeStr.slice(0, 5);
  };

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

      {/* Topbar */}
      <header className="topbar">
        <div className="brand-mobile">
          <div className="brand-icon">
            <CalendarDays size={17} />
          </div>
          <strong>Campus Events</strong>
        </div>

        <form className="search-wrap" onSubmit={handleSearchSubmit}>
          <Search size={17} />
          <input
            type="text"
            placeholder="Search events by title, venue, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

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
            <h1>Explore Campus Events</h1>
            <p>Browse, filter and register for upcoming student activities, workshops, and competitions.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar" style={{ marginBottom: "24px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <section className="content-card">
          <div className="card-head">
            <div>
              <h2>All Available Events ({events.length})</h2>
              <p>Click on an event to view full details or register.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              Loading campus events...
            </div>
          ) : events.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No events found matching your criteria.
            </div>
          ) : (
            <div className="event-list student-event-list">
              {events.map((event) => {
                const isRegistered = myRegistrations.some(
                  (r) => r.event_id === event.id && r.registration_status === "registered"
                );
                const isFull = event.capacity && (event.total_registrations >= event.capacity);

                return (
                  <div className="event-row" key={event.id}>
                    <div className={`event-date ${event.category?.toLowerCase() || "technical"}`}>
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <div className="event-title-line">
                        <h3>{event.title}</h3>
                        <span className="tag">{event.category}</span>
                        {event.club_name && <span className="chip-sm">{event.club_name}</span>}
                        {event.status === "completed" && (
                          <span className="badge badge-neutral" style={{ fontSize: "11px" }}>Completed</span>
                        )}
                        {event.status === "ongoing" && (
                          <span className="badge badge-warning" style={{ fontSize: "11px" }}>Ongoing</span>
                        )}
                      </div>

                      <div className="meta-row">
                        <span>
                          <Clock3 size={13} />
                          {event.event_date} ({formatTime(event.start_time)} - {formatTime(event.end_time)})
                        </span>

                        <span>
                          <MapPin size={13} />
                          {event.venue_name || "TBA"}
                        </span>

                        <span>
                          <Users size={13} />
                          {event.total_registrations || 0} / {event.capacity || 100} registered
                        </span>
                      </div>
                    </div>

                    <div className="event-reg">
                      <b>{event.total_registrations || 0}</b>
                      <span>Registered</span>
                    </div>

                    <div className="row-actions">
                      {isRegistered ? (
                        <span className="badge badge-success" style={{ fontSize: "12px", padding: "6px 12px" }}>
                          <CheckCircle2 size={13} style={{ marginRight: "4px" }} />
                          Registered
                        </span>
                      ) : isFull ? (
                        <span className="badge badge-warning" style={{ fontSize: "12px", padding: "6px 12px" }}>
                          Full
                        </span>
                      ) : event.status === "completed" || event.status === "cancelled" ? (
                        <span className="badge badge-neutral" style={{ fontSize: "12px", padding: "6px 12px" }}>
                          Closed
                        </span>
                      ) : (
                        <button
                          className="btn-sm primary"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register
                        </button>
                      )}

                      <button
                        className="icon-btn"
                        onClick={() => onNavigate("event-details", event.id)}
                        title="View Details"
                      >
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Events;