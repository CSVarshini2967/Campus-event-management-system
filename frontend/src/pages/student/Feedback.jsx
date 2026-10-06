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
  Star,
  Send,
  CheckCircle2,
} from "lucide-react";

function Feedback({ user, onNavigate }) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const registeredEvents = [
    "CSE Tech Fest",
    "Cultural Night",
    "Sports Meet",
  ];

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedEvent) {
      alert("Please select an event.");
      return;
    }

    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }

    if (!feedback.trim()) {
      alert("Please write your feedback.");
      return;
    }

    setSubmitted(true);
  }

  function handleLogout() {
    localStorage.removeItem("campus_event_student_session");
    sessionStorage.removeItem("student_current_page");
    window.location.reload();
  }

  function resetForm() {
    setSelectedEvent("");
    setRating(0);
    setFeedback("");
    setSubmitted(false);
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

          <button
            className="side-link"
            onClick={() => onNavigate("my-events")}
          >
            <ClipboardList size={18} />
            <span>My Events</span>
          </button>

          <button className="side-link active">
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

        <div className="page-header">

          <div>
            <h1>Event Feedback</h1>

            <p>
              Share your experience and help us improve future campus events.
            </p>
          </div>

        </div>

        {submitted ? (

          <section className="content-card">

            <div className="empty-state">

              <CheckCircle2 size={55} />

              <h2>Thank You!</h2>

              <p>
                Your feedback has been submitted successfully.
              </p>

              <button
                className="primary-btn"
                onClick={resetForm}
              >
                Submit Another Feedback
              </button>

            </div>

          </section>

        ) : (

          <section className="content-card">

            <div className="card-head">

              <div>
                <h2>Share Your Experience</h2>

                <p>
                  Tell us what you liked and what we can improve.
                </p>
              </div>

              <MessageSquare size={21} />

            </div>

            <form
              className="form-grid"
              onSubmit={handleSubmit}
            >

              {/* Event */}
              <div className="form-group">

                <label htmlFor="event">
                  Select Event
                </label>

                <select
                  id="event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="">
                    Choose an event
                  </option>

                  {registeredEvents.map((event) => (
                    <option
                      key={event}
                      value={event}
                    >
                      {event}
                    </option>
                  ))}

                </select>

              </div>

              {/* Rating */}
              <div className="form-group">

                <label>
                  Rate Your Experience
                </label>

                <div className="rating">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      type="button"
                      key={star}
                      className={`star ${
                        rating >= star ? "selected" : ""
                      }`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star
                        size={28}
                        fill={
                          rating >= star
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                  ))}

                </div>

                <small>
                  {rating === 0
                    ? "Select a rating from 1 to 5"
                    : `${rating} out of 5 stars`}
                </small>

              </div>

              {/* Feedback */}
              <div className="form-group">

                <label htmlFor="feedback">
                  Your Feedback
                </label>

                <textarea
                  id="feedback"
                  rows="7"
                  placeholder="Write your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />

              </div>

              {/* Submit */}
              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => onNavigate("dashboard")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <Send size={16} />
                  Submit Feedback
                </button>

              </div>

            </form>

          </section>

        )}

        {/* Guidelines */}
        <section className="content-card">

          <div className="card-head">

            <div>
              <h2>Feedback Guidelines</h2>

              <p>
                Please keep your feedback constructive and respectful.
              </p>
            </div>

          </div>

          <div className="event-description">

            <ul>
              <li>
                Share your honest experience about the event.
              </li>

              <li>
                Mention what you enjoyed the most.
              </li>

              <li>
                Suggest improvements for future events.
              </li>

              <li>
                Avoid sharing personal or sensitive information.
              </li>
            </ul>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Feedback;