import React, { useState } from "react";
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
  Users,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

function EventDetails({ user, onNavigate }) {
  const [registered, setRegistered] = useState(false);

  const event = {
    title: "CSE Tech Fest",
    category: "Technical",
    date: "15 Nov 2026",
    time: "10:00 AM - 4:00 PM",
    venue: "Seminar Hall",
    registrations: 96,
    capacity: 150,
    description:
      "CSE Tech Fest is a technical campus event where students can participate in technology-focused activities, competitions, workshops and discussions.",
    organizer: "Department of Computer Science and Engineering",
  };

  function handleLogout() {
    localStorage.removeItem("campus_event_student_session");
    sessionStorage.removeItem("student_current_page");
    window.location.reload();
  }

  function handleRegister() {
    setRegistered(true);
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
            className="side-link active"
            onClick={() => onNavigate("events")}
          >
            <CalendarDays size={18} />
            <span>Events</span>
          </button>

          <button
            className="side-link"
            onClick={() => onNavigate("my-events")}
          >
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

        {/* Back */}
        <button
          className="back-btn"
          onClick={() => onNavigate("events")}
        >
          <ArrowLeft size={17} />
          Back to Events
        </button>

        {/* Event Header */}
        <section className="content-card">

          <div className="event-details-header">

            <div className="event-details-icon">
              <CalendarDays size={32} />
            </div>

            <div className="event-details-title">

              <span className="tag">
                {event.category}
              </span>

              <h1>{event.title}</h1>

              <p>
                Organized by {event.organizer}
              </p>

            </div>

          </div>

        </section>

        {/* Event Information */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Event Information</h2>

              <p>
                Everything you need to know about this event.
              </p>
            </div>

          </div>

          <div className="event-info-grid">

            <div className="info-item">

              <CalendarDays size={20} />

              <div>
                <span>Date</span>
                <strong>{event.date}</strong>
              </div>

            </div>

            <div className="info-item">

              <Clock3 size={20} />

              <div>
                <span>Time</span>
                <strong>{event.time}</strong>
              </div>

            </div>

            <div className="info-item">

              <MapPin size={20} />

              <div>
                <span>Venue</span>
                <strong>{event.venue}</strong>
              </div>

            </div>

            <div className="info-item">

              <Users size={20} />

              <div>
                <span>Registrations</span>
                <strong>
                  {event.registrations} / {event.capacity}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* Description */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>About This Event</h2>

              <p>
                Learn more about the event.
              </p>
            </div>

          </div>

          <div className="event-description">

            <p>
              {event.description}
            </p>

            <p>
              Students are encouraged to participate actively,
              learn from other participants and make the most
              of this campus experience.
            </p>

          </div>

        </section>

        {/* Registration */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Registration</h2>

              <p>
                Reserve your place for this event.
              </p>
            </div>

          </div>

          <div className="registration-box">

            <div>

              {registered ? (
                <>
                  <div className="registration-success">

                    <CheckCircle2 size={22} />

                    <div>
                      <strong>Registration Successful</strong>

                      <p>
                        You are registered for {event.title}.
                      </p>
                    </div>

                  </div>
                </>
              ) : (
                <>
                  <strong>Ready to participate?</strong>

                  <p>
                    Click the button to register for this event.
                  </p>
                </>
              )}

            </div>

            {!registered && (
              <button
                className="primary-btn"
                onClick={handleRegister}
              >
                <CheckCircle2 size={17} />
                Register Now
              </button>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default EventDetails;