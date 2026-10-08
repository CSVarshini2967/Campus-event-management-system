import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Home,
  LogOut,
  Star,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { feedbackService, registrationService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Feedback({ initialEventId, onNavigate }) {
  const { user, logout } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || "");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await registrationService.getMyRegistrations();
        const active = (data || []).filter((r) => r.registration_status === "registered");
        setRegisteredEvents(active);
        if (!selectedEventId && active.length > 0) {
          setSelectedEventId(active[0].event_id);
        }
      } catch (err) {
        console.error("Failed to load registrations:", err);
      }
    }
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEventId) {
      showToast("Please select an event to review.", "error");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      showToast("Please select a star rating between 1 and 5.", "error");
      return;
    }

    try {
      setLoading(true);
      await feedbackService.submit(selectedEventId, { rating, comment });
      setSubmitted(true);
      showToast("Thank you! Your feedback has been submitted.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit feedback.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRating(5);
    setComment("");
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
          <button className="side-link" onClick={() => onNavigate("events")}>
            <CalendarDays size={18} />
            <span>Events</span>
          </button>
          <button className="side-link" onClick={() => onNavigate("my-events")}>
            <ClipboardList size={18} />
            <span>My Events</span>
          </button>
          <button className="side-link active" onClick={() => onNavigate("feedback")}>
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
        <div className="page-header">
          <div>
            <h1>Event Feedback & Ratings</h1>
            <p>Share your event experience to help organizers enhance future campus activities.</p>
          </div>
        </div>

        <div style={{ maxWidth: "680px" }}>
          {submitted ? (
            <div className="content-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>Feedback Received!</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                Thank you for rating your campus event. Your feedback is appreciated.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="primary-btn" onClick={resetForm}>
                  Submit Another Feedback
                </button>
                <button className="btn-sm" onClick={() => onNavigate("my-events")}>
                  View My Events
                </button>
              </div>
            </div>
          ) : (
            <div className="content-card">
              <div className="card-head">
                <div>
                  <h2>Submit Event Review</h2>
                  <p>Select a registered event and leave your honest rating and thoughts.</p>
                </div>
              </div>

              {registeredEvents.length === 0 ? (
                <div style={{ padding: "24px 0", color: "var(--text-muted)" }}>
                  <p>You have not registered for any events yet. You can only review events you have registered for.</p>
                  <button className="primary-btn" style={{ marginTop: "16px" }} onClick={() => onNavigate("events")}>
                    Browse Events
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                      Select Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    >
                      {registeredEvents.map((r) => (
                        <option key={r.event_id} value={r.event_id}>
                          {r.title} ({r.event_date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
                          >
                            <Star
                              size={28}
                              color={active ? "#f59e0b" : "rgba(255,255,255,0.2)"}
                              fill={active ? "#f59e0b" : "none"}
                            />
                          </button>
                        );
                      })}
                      <span style={{ alignSelf: "center", marginLeft: "8px", color: "#f59e0b", fontWeight: "bold" }}>
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                      Comments & Experience
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like most? What can be improved?"
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical" }}
                    />
                  </div>

                  <button className="primary-btn" type="submit" disabled={loading} style={{ alignSelf: "flex-start" }}>
                    <Send size={16} />
                    {loading ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Feedback;