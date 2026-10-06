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
  Users,
} from "lucide-react";

function StudentDashboard({ onNavigate, user }) {
  const upcomingEvents = [
    {
      id: 1,
      title: "CSE Tech Fest",
      category: "Technical",
      date: "15 Nov 2026",
      time: "10:00 AM - 4:00 PM",
      venue: "Seminar Hall",
      registrations: 96,
    },
    {
      id: 2,
      title: "Cultural Night",
      category: "Cultural",
      date: "18 Nov 2026",
      time: "5:00 PM - 10:00 PM",
      venue: "Main Auditorium",
      registrations: 72,
    },
    {
      id: 3,
      title: "Sports Meet",
      category: "Sports",
      date: "22 Nov 2026",
      time: "9:00 AM - 5:00 PM",
      venue: "College Ground",
      registrations: 54,
    },
  ];

  function handleLogout() {
    localStorage.removeItem("campus_event_student_session");
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
          <button className="side-link active">
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

        {/* Header */}
        <div className="page-header">

          <div>
            <h1>Student Dashboard</h1>

            <p>
              Welcome back! Discover campus events and activities.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => onNavigate("events")}
          >
            <CalendarDays size={16} />
            Explore Events
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
              <strong>8</strong>
              <small>Events available</small>
            </div>

          </div>

          <div className="stat-card purple">

            <div className="stat-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <span>My Registrations</span>
              <strong>3</strong>
              <small>Events registered</small>
            </div>

          </div>

          <div className="stat-card green">

            <div className="stat-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Completed Events</span>
              <strong>5</strong>
              <small>Events attended</small>
            </div>

          </div>

          <div className="stat-card orange">

            <div className="stat-icon">
              <MessageSquare size={21} />
            </div>

            <div>
              <span>Feedback Pending</span>
              <strong>2</strong>
              <small>Feedback required</small>
            </div>

          </div>

        </section>

        {/* Upcoming Events */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Upcoming Events</h2>

              <p>
                Discover and participate in upcoming campus activities.
              </p>
            </div>

            <button
              className="text-btn"
              onClick={() => onNavigate("events")}
            >
              View All
              <ArrowRight size={14} />
            </button>

          </div>

          <div className="event-list student-event-list">

            {upcomingEvents.map((event) => (

              <div className="event-row" key={event.id}>

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

                    <span>
                      <Users size={13} />
                      {event.registrations} registered
                    </span>

                  </div>

                </div>

                <div className="event-reg">
                  <b>{event.registrations}</b>
                  <span>Registered</span>
                </div>

                <div className="row-actions">

                  <button title="View Event">
                    <ArrowRight size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Quick Actions */}
        <section className="quick-footer student-quick-footer">

          <div className="quick-footer-title">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Access frequently used student features.
              </p>
            </div>

          </div>

          <div className="quick-grid">

            <button
              className="quick blue"
              onClick={() => onNavigate("events")}
            >
              <CalendarDays size={22} />

              <span>
                <b>Browse Events</b>
                <small>Find upcoming campus events</small>
              </span>

            </button>

            <button
              className="quick purple"
              onClick={() => onNavigate("my-events")}
            >
              <ClipboardList size={22} />

              <span>
                <b>My Events</b>
                <small>View your registered events</small>
              </span>

            </button>

            <button
              className="quick green"
              onClick={() => onNavigate("feedback")}
            >
              <MessageSquare size={22} />

              <span>
                <b>Give Feedback</b>
                <small>Share your event experience</small>
              </span>

            </button>

            <button className="quick cyan">

              <Settings size={22} />

              <span>
                <b>Settings</b>
                <small>Manage your preferences</small>
              </span>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;