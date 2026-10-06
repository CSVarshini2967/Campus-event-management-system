import React from "react";
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
  CheckCircle2,
  XCircle,
} from "lucide-react";

function MyEvents({ user, onNavigate }) {
  const registeredEvents = [
    {
      id: 1,
      title: "CSE Tech Fest",
      category: "Technical",
      date: "15 Nov 2026",
      time: "10:00 AM - 4:00 PM",
      venue: "Seminar Hall",
      status: "Registered",
    },
    {
      id: 2,
      title: "Cultural Night",
      category: "Cultural",
      date: "18 Nov 2026",
      time: "5:00 PM - 10:00 PM",
      venue: "Main Auditorium",
      status: "Registered",
    },
    {
      id: 3,
      title: "Sports Meet",
      category: "Sports",
      date: "22 Nov 2026",
      time: "9:00 AM - 5:00 PM",
      venue: "College Ground",
      status: "Registered",
    },
  ];

  function handleLogout() {
    localStorage.removeItem("campus_event_student_session");
    sessionStorage.removeItem("student_current_page");
    window.location.reload();
  }

  return (
    <div className="app-shell student-app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <strong>Campus Events</strong>
            <span>Management System</span>
          </div>
        </div>

        <nav>

          <button
            className="side-link"
            onClick={() => onNavigate("dashboard")}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className="side-link"
            onClick={() => onNavigate("events")}
          >
            <CalendarDays size={18} />
            <span>Events</span>
          </button>

          <button className="side-link active">
            <ClipboardList size={18} />
            <span>My Events</span>
          </button>

          <button
            className="side-link"
            onClick={() => onNavigate("feedback")}
          >
            <MessageSquare size={18} />
            <span>Feedback</span>
          </button>

          <button className="side-link">
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="side-link logout"
            onClick={handleLogout}
          >
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
            placeholder="Search events..."
          />
        </div>

        <div className="top-actions">

          <button className="icon-btn">
            <Bell size={19} />
            <span className="notification-dot"></span>
          </button>

          <div className="profile">

            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div className="profile-copy">
              <b>{user?.name || "Student"}</b>
              <span>{user?.department || "Student"}</span>
            </div>

          </div>

        </div>

      </header>

      {/* Main */}
      <main className="main">

        {/* Page Header */}
        <div className="page-header">

          <div>
            <h1>My Events</h1>

            <p>
              View and manage the campus events you have registered for.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => onNavigate("events")}
          >
            <CalendarDays size={16} />
            Explore More Events
          </button>

        </div>

        {/* Summary */}
        <section className="stat-grid">

          <div className="stat-card blue">

            <div className="stat-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <span>Total Registrations</span>
              <strong>{registeredEvents.length}</strong>
              <small>Events registered</small>
            </div>

          </div>

          <div className="stat-card green">

            <div className="stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Active Registrations</span>
              <strong>{registeredEvents.length}</strong>
              <small>Upcoming events</small>
            </div>

          </div>

          <div className="stat-card purple">

            <div className="stat-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Upcoming</span>
              <strong>{registeredEvents.length}</strong>
              <small>Events to attend</small>
            </div>

          </div>

          <div className="stat-card orange">

            <div className="stat-icon">
              <MessageSquare size={21} />
            </div>

            <div>
              <span>Feedback</span>
              <strong>2</strong>
              <small>Pending feedback</small>
            </div>

          </div>

        </section>

        {/* Registered Events */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Registered Events</h2>

              <p>
                Your upcoming event registrations.
              </p>
            </div>

          </div>

          <div className="event-list student-event-list">

            {registeredEvents.map((event) => (

              <div
                className="event-row"
                key={event.id}
              >

                <div
                  className={`event-date ${event.category.toLowerCase()}`}
                >
                  <CalendarDays size={20} />
                </div>

                <div>

                  <div className="event-title-line">

                    <h3>{event.title}</h3>

                    <span className="tag">
                      {event.category}
                    </span>

                  </div>

                  <div className="meta-row">

                    <span>
                      <Clock3 size={13} />
                      {event.time}
                    </span>

                    <span>
                      <MapPin size={13} />
                      {event.venue}
                    </span>

                  </div>

                  <small>
                    {event.date}
                  </small>

                </div>

                <div className="event-reg">

                  <CheckCircle2 size={18} />

                  <span>{event.status}</span>

                </div>

                <div className="row-actions">

                  <button
                    title="View Event"
                    onClick={() => onNavigate("event-details")}
                  >
                    <ArrowRight size={15} />
                  </button>

                  <button
                    title="Cancel Registration"
                    onClick={() =>
                      alert(
                        `Registration cancellation for ${event.title} will be connected to the backend later.`
                      )
                    }
                  >
                    <XCircle size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default MyEvents;