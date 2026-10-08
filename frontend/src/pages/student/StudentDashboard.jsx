import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  Clock3,
  MapPin,
  ArrowRight,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { eventService, registrationService, statsService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard({ onNavigate }) {
  const { user, logout } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    registered: 0,
    completed: 0,
    feedbackPending: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsData, myRegData, globalStats] = await Promise.all([
        eventService.getAll({ status: "upcoming" }),
        registrationService.getMyRegistrations(),
        statsService.getDashboard().catch(() => null)
      ]);

      setUpcomingEvents(eventsData || []);
      setMyRegistrations(myRegData || []);

      const activeRegs = (myRegData || []).filter((r) => r.registration_status === "registered");
      const completedEvents = (myRegData || []).filter(
        (r) => r.event_status === "completed" || new Date(r.event_date) < new Date()
      );
      const pendingFb = completedEvents.filter((r) => !r.feedback_rating);

      setStats({
        upcoming: eventsData?.length || globalStats?.events?.upcoming || 0,
        registered: activeRegs.length,
        completed: completedEvents.length,
        feedbackPending: pendingFb.length
      });
    } catch (err) {
      console.error("Failed to load student dashboard:", err);
      showToast("Could not load latest event data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await registrationService.register(eventId);
      showToast("Successfully registered for the event!");
      loadDashboardData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register for event.", "error");
    }
  };

  const filteredUpcoming = upcomingEvents.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.venue_name && e.venue_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <button className="side-link active" onClick={() => onNavigate("dashboard")}>
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button className="side-link" onClick={() => onNavigate("events")}>
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

        <div className="search-wrap">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search upcoming events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      {/* Main */}
      <main className="main">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {user?.name || "Student"}! Discover campus events and manage registrations.</p>
          </div>

          <button className="primary-btn" onClick={() => onNavigate("events")}>
            <CalendarDays size={16} />
            Explore All Events
          </button>
        </div>

        {/* Statistics */}
        <section className="stat-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <CalendarDays size={21} />
            </div>
            <div>
              <span>Upcoming Events</span>
              <strong>{stats.upcoming}</strong>
              <small>Events available</small>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <ClipboardList size={21} />
            </div>
            <div>
              <span>My Registrations</span>
              <strong>{stats.registered}</strong>
              <small>Active registrations</small>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Completed Events</span>
              <strong>{stats.completed}</strong>
              <small>Events participated</small>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <MessageSquare size={21} />
            </div>
            <div>
              <span>Feedback Required</span>
              <strong>{stats.feedbackPending}</strong>
              <small>Reviews pending</small>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="content-card">
          <div className="card-head">
            <div>
              <h2>Upcoming Campus Events</h2>
              <p>Discover and register for upcoming activities across departments.</p>
            </div>

            <button className="text-btn" onClick={() => onNavigate("events")}>
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
              Loading upcoming events...
            </div>
          ) : filteredUpcoming.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
              No upcoming events found matching your search.
            </div>
          ) : (
            <div className="event-list student-event-list">
              {filteredUpcoming.slice(0, 5).map((event) => {
                const isRegistered = myRegistrations.some(
                  (r) => r.event_id === event.id && r.registration_status === "registered"
                );

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
                      ) : (
                        <button
                          className="btn-sm primary"
                          onClick={() => handleRegister(event.id)}
                          title="Register for Event"
                        >
                          Register
                        </button>
                      )}
                      <button
                        className="icon-btn"
                        onClick={() => onNavigate("event-details", event.id)}
                        title="View Event Details"
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

        {/* Quick Actions */}
        <section className="quick-footer student-quick-footer">
          <div className="quick-footer-title">
            <div>
              <h2>Quick Actions</h2>
              <p>Access student portals, events, and feedback tools.</p>
            </div>
          </div>

          <div className="quick-grid">
            <button className="quick blue" onClick={() => onNavigate("events")}>
              <CalendarDays size={22} />
              <span>
                <b>Browse Events</b>
                <small>Find upcoming campus events</small>
              </span>
            </button>

            <button className="quick purple" onClick={() => onNavigate("my-events")}>
              <ClipboardList size={22} />
              <span>
                <b>My Events</b>
                <small>View your registered events & attendance</small>
              </span>
            </button>

            <button className="quick green" onClick={() => onNavigate("feedback")}>
              <MessageSquare size={22} />
              <span>
                <b>Give Feedback</b>
                <small>Rate and review attended events</small>
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;