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
  ArrowRight,
  Filter,
} from "lucide-react";

function Events({ user, onNavigate }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const events = [
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
    {
      id: 4,
      title: "AI & Machine Learning Workshop",
      category: "Technical",
      date: "25 Nov 2026",
      time: "10:00 AM - 1:00 PM",
      venue: "Computer Lab",
      registrations: 88,
    },
    {
      id: 5,
      title: "Photography Contest",
      category: "Cultural",
      date: "28 Nov 2026",
      time: "11:00 AM - 3:00 PM",
      venue: "Open Auditorium",
      registrations: 41,
    },
    {
      id: 6,
      title: "Inter College Cricket",
      category: "Sports",
      date: "2 Dec 2026",
      time: "8:00 AM - 4:00 PM",
      venue: "College Ground",
      registrations: 120,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

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

          <button className="side-link active">
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <h1>Campus Events</h1>

            <p>
              Explore upcoming events and participate in campus activities.
            </p>
          </div>

        </div>

        {/* Filters */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Find Events</h2>

              <p>
                Search and filter events based on your interests.
              </p>
            </div>

            <Filter size={20} />

          </div>

          <div className="filter-row">

            <button
              className={`filter-pill ${
                category === "All" ? "active" : ""
              }`}
              onClick={() => setCategory("All")}
            >
              All
            </button>

            <button
              className={`filter-pill ${
                category === "Technical" ? "active" : ""
              }`}
              onClick={() => setCategory("Technical")}
            >
              Technical
            </button>

            <button
              className={`filter-pill ${
                category === "Cultural" ? "active" : ""
              }`}
              onClick={() => setCategory("Cultural")}
            >
              Cultural
            </button>

            <button
              className={`filter-pill ${
                category === "Sports" ? "active" : ""
              }`}
              onClick={() => setCategory("Sports")}
            >
              Sports
            </button>

          </div>

        </section>

        {/* Event List */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Upcoming Events</h2>

              <p>
                {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""} available
              </p>
            </div>

          </div>

          <div className="event-list student-event-list">

            {filteredEvents.length === 0 ? (

              <div className="empty-state">
                <CalendarDays size={35} />

                <h3>No events found</h3>

                <p>
                  Try changing your search or category filter.
                </p>
              </div>

            ) : (

              filteredEvents.map((event) => (

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

                      <span>
                        <Users size={13} />
                        {event.registrations} registered
                      </span>

                    </div>

                    <small>
                      {event.date}
                    </small>

                  </div>

                  <div className="event-reg">

                    <b>{event.registrations}</b>

                    <span>Registered</span>

                  </div>

                  <div className="row-actions">

                    <button
                      title="View Event"
                      onClick={() => onNavigate("event-details")}
                    >
                      <ArrowRight size={15} />
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Events;