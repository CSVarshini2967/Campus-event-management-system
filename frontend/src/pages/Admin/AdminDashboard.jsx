import React, { useEffect, useMemo, useState } from "react";
import {
  Bell, CalendarDays, ChevronDown, CirclePlus,
  ClipboardList, Clock3, Edit3, Eye, Home, LayoutDashboard, LogOut,
  MapPin, Menu, Plus, Search, Settings, ShieldCheck, Trash2, Users,
  Building2, X, CheckCircle2, AlertCircle, Star, CheckSquare, Square
} from "lucide-react";
import {
  eventService,
  clubService,
  venueService,
  registrationService,
  attendanceService,
  feedbackService,
  statsService
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal and toast states
  const [modal, setModal] = useState(null); // { type: 'addEvent'|'editEvent'|'addClub'|'addVenue'|'eventStudents'|'eventFeedback', data?: any }
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [eventFeedbackData, setEventFeedbackData] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [evList, clList, vnList, statData] = await Promise.all([
        eventService.getAll().catch(() => []),
        clubService.getAll().catch(() => []),
        venueService.getAll().catch(() => []),
        statsService.getDashboard().catch(() => null)
      ]);
      setEvents(evList || []);
      setClubs(clList || []);
      setVenues(vnList || []);
      setStats(statData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      notify("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Event handlers
  const handleCreateEvent = async (formData) => {
    try {
      await eventService.create(formData);
      notify("Event created successfully!");
      setModal(null);
      loadAllData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to create event.", "error");
    }
  };

  const handleUpdateEvent = async (id, formData) => {
    try {
      await eventService.update(id, formData);
      notify("Event updated successfully!");
      setModal(null);
      loadAllData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update event.", "error");
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await eventService.delete(id);
      notify("Event deleted successfully.");
      loadAllData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete event.", "error");
    }
  };

  // Club handlers
  const handleCreateClub = async (formData) => {
    try {
      await clubService.create(formData);
      notify("Club registered successfully!");
      setModal(null);
      loadAllData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to create club.", "error");
    }
  };

  // Venue handlers
  const handleCreateVenue = async (formData) => {
    try {
      await venueService.create(formData);
      notify("Venue added successfully!");
      setModal(null);
      loadAllData();
    } catch (err) {
      notify(err.response?.data?.message || "Failed to create venue.", "error");
    }
  };

  // Load registered students for an event
  const openRegistrationsModal = async (event) => {
    try {
      setSelectedEventId(event.id);
      const list = await registrationService.getEventRegistrations(event.id);
      setEventRegistrations(list || []);
      setModal({ type: "eventStudents", event });
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load registrations.", "error");
    }
  };

  // Mark attendance
  const handleToggleAttendance = async (regId, currentStatus) => {
    const newStatus = currentStatus === "present" ? "absent" : "present";
    try {
      await attendanceService.mark({ registration_id: regId, status: newStatus });
      setEventRegistrations((prev) =>
        prev.map((r) => (r.registration_id === regId ? { ...r, attendance_status: newStatus } : r))
      );
      notify(`Attendance updated to ${newStatus}.`);
    } catch (err) {
      notify("Failed to update attendance.", "error");
    }
  };

  // Bulk mark attendance
  const handleBulkAttendance = async (status) => {
    if (eventRegistrations.length === 0) return;
    try {
      const records = eventRegistrations.map((r) => ({
        registration_id: r.registration_id,
        status
      }));
      await attendanceService.mark({ records });
      setEventRegistrations((prev) =>
        prev.map((r) => ({ ...r, attendance_status: status }))
      );
      notify(`Marked all students as ${status}.`);
    } catch (err) {
      notify("Bulk attendance update failed.", "error");
    }
  };

  // Load Feedback for an event
  const openFeedbackModal = async (event) => {
    try {
      const data = await feedbackService.getEventFeedback(event.id);
      setEventFeedbackData(data);
      setModal({ type: "eventFeedback", event });
    } catch (err) {
      notify("Failed to load feedback.", "error");
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(query.toLowerCase()) ||
    e.category?.toLowerCase().includes(query.toLowerCase()) ||
    e.venue_name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-shell">
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
            <span>{user?.role === "admin" ? "Admin Portal" : "Organiser Portal"}</span>
          </div>
        </div>

        <nav>
          <button
            className={`side-link ${activeTab === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("Dashboard")}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`side-link ${activeTab === "Events" ? "active" : ""}`}
            onClick={() => setActiveTab("Events")}
          >
            <CalendarDays size={18} />
            <span>Manage Events</span>
          </button>

          <button
            className={`side-link ${activeTab === "Clubs" ? "active" : ""}`}
            onClick={() => setActiveTab("Clubs")}
          >
            <Users size={18} />
            <span>Clubs & Bodies</span>
          </button>

          <button
            className={`side-link ${activeTab === "Venues" ? "active" : ""}`}
            onClick={() => setActiveTab("Venues")}
          >
            <Building2 size={18} />
            <span>Campus Venues</span>
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
            placeholder="Search events, clubs, venues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="top-actions">
          <div className="profile">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="profile-copy">
              <b>{user?.name || "Admin"}</b>
              <span style={{ textTransform: "capitalize" }}>{user?.role || "Admin"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main">
        {/* Render Tab 1: Dashboard Overview */}
        {activeTab === "Dashboard" && (
          <>
            <div className="page-header">
              <div>
                <h1>Dashboard Overview</h1>
                <p>Real-time campus event registrations, attendance rates, and scheduled venues.</p>
              </div>

              <button className="primary-btn" onClick={() => setModal({ type: "addEvent" })}>
                <Plus size={16} />
                Create New Event
              </button>
            </div>

            {/* Statistics Row */}
            <section className="stat-grid">
              <div className="stat-card blue">
                <div className="stat-icon"><CalendarDays size={21} /></div>
                <div>
                  <span>Total Events</span>
                  <strong>{stats?.events?.total || events.length}</strong>
                  <small>{stats?.events?.upcoming || 0} upcoming</small>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-icon"><ClipboardList size={21} /></div>
                <div>
                  <span>Total Registrations</span>
                  <strong>{stats?.registrations?.total || 0}</strong>
                  <small>{stats?.registrations?.active || 0} active</small>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-icon"><CheckCircle2 size={21} /></div>
                <div>
                  <span>Attendance Rate</span>
                  <strong>{stats?.attendance?.percentage || 0}%</strong>
                  <small>{stats?.attendance?.present || 0} present attendees</small>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-icon"><Building2 size={21} /></div>
                <div>
                  <span>Clubs & Venues</span>
                  <strong>{clubs.length} / {venues.length}</strong>
                  <small>Clubs / Venues configured</small>
                </div>
              </div>
            </section>

            {/* Recent Events List */}
            <section className="content-card" style={{ marginTop: "24px" }}>
              <div className="card-head">
                <div>
                  <h2>All Scheduled Events ({filteredEvents.length})</h2>
                  <p>Manage, track attendance, and inspect reviews for campus events.</p>
                </div>

                <button className="text-btn" onClick={() => setActiveTab("Events")}>
                  Manage All Events
                </button>
              </div>

              <div className="event-list">
                {filteredEvents.slice(0, 6).map((event) => (
                  <div className="event-row" key={event.id}>
                    <div className={`event-date ${event.category?.toLowerCase() || "technical"}`}>
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <div className="event-title-line">
                        <h3>{event.title}</h3>
                        <span className="tag">{event.category}</span>
                        {event.club_name && <span className="chip-sm">{event.club_name}</span>}
                        <span className={`badge ${event.status === "completed" ? "badge-neutral" : "badge-success"}`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="meta-row">
                        <span><Clock3 size={13} />{event.event_date} ({event.start_time?.slice(0,5)} - {event.end_time?.slice(0,5)})</span>
                        <span><MapPin size={13} />{event.venue_name || "TBA"}</span>
                        <span><Users size={13} />{event.total_registrations || 0} registered</span>
                        {event.avg_rating > 0 && (
                          <span style={{ color: "#f59e0b", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            <Star size={12} fill="#f59e0b" /> {event.avg_rating} ({event.total_feedback})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="event-reg">
                      <b>{event.total_registrations || 0}</b>
                      <span>Registered</span>
                    </div>

                    <div className="row-actions">
                      <button
                        className="btn-sm"
                        onClick={() => openRegistrationsModal(event)}
                        title="View Registrations & Attendance"
                      >
                        <Users size={14} style={{ marginRight: "4px" }} />
                        Roster
                      </button>
                      <button
                        className="btn-sm"
                        onClick={() => openFeedbackModal(event)}
                        title="View Feedback"
                      >
                        <Star size={14} style={{ marginRight: "4px" }} />
                        Reviews
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => setModal({ type: "editEvent", event })}
                        title="Edit Event"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Render Tab 2: Manage Events */}
        {activeTab === "Events" && (
          <section className="content-card">
            <div className="card-head">
              <div>
                <h1>Manage Events</h1>
                <p>Create, edit, cancel, and oversee participant registrations and attendance.</p>
              </div>

              <button className="primary-btn" onClick={() => setModal({ type: "addEvent" })}>
                <Plus size={16} />
                New Event
              </button>
            </div>

            <div className="event-list">
              {filteredEvents.map((event) => (
                <div className="event-row" key={event.id}>
                  <div className={`event-date ${event.category?.toLowerCase() || "technical"}`}>
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <div className="event-title-line">
                      <h3>{event.title}</h3>
                      <span className="tag">{event.category}</span>
                      <span className={`badge ${event.status === "completed" ? "badge-neutral" : "badge-success"}`}>
                        {event.status}
                      </span>
                    </div>

                    <div className="meta-row">
                      <span><Clock3 size={13} />{event.event_date} ({event.start_time?.slice(0,5)} - {event.end_time?.slice(0,5)})</span>
                      <span><MapPin size={13} />{event.venue_name || "TBA"}</span>
                      <span><Users size={13} />Capacity: {event.total_registrations || 0} / {event.capacity || 100}</span>
                    </div>
                  </div>

                  <div className="row-actions">
                    <button className="btn-sm" onClick={() => openRegistrationsModal(event)}>
                      <Users size={14} style={{ marginRight: "4px" }} /> Roster & Attendance
                    </button>
                    <button className="btn-sm" onClick={() => openFeedbackModal(event)}>
                      <Star size={14} style={{ marginRight: "4px" }} /> Reviews
                    </button>
                    <button className="icon-btn" onClick={() => setModal({ type: "editEvent", event })}>
                      <Edit3 size={15} />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDeleteEvent(event.id, event.title)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Render Tab 3: Manage Clubs */}
        {activeTab === "Clubs" && (
          <section className="content-card">
            <div className="card-head">
              <div>
                <h1>Clubs & Student Bodies</h1>
                <p>Manage student clubs, technical chapters, and appointed faculty coordinators.</p>
              </div>

              <button className="primary-btn" onClick={() => setModal({ type: "addClub" })}>
                <Plus size={16} />
                Add Club
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
              {clubs.map((club) => (
                <div key={club.id} style={{ background: "rgba(255,255,255,0.03)", padding: "18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{club.name}</h3>
                    <span className="tag">Club</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", minHeight: "38px" }}>
                    {club.description || "No description provided."}
                  </p>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                    <span>Coordinator: <b>{club.coordinator_name || "Faculty"}</b></span>
                    <span><b>{club.total_events || 0}</b> events</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Render Tab 4: Manage Venues */}
        {activeTab === "Venues" && (
          <section className="content-card">
            <div className="card-head">
              <div>
                <h1>Campus Venues & Auditoriums</h1>
                <p>View auditorium capacity, classroom blocks, and prevent schedule double-booking.</p>
              </div>

              <button className="primary-btn" onClick={() => setModal({ type: "addVenue" })}>
                <Plus size={16} />
                Add Venue
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
              {venues.map((venue) => (
                <div key={venue.id} style={{ background: "rgba(255,255,255,0.03)", padding: "18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{venue.name}</h3>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
                    <MapPin size={13} style={{ marginRight: "4px", display: "inline" }} />
                    {venue.location || "Campus Location"}
                  </p>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                    <span>Capacity: <b>{venue.capacity} seats</b></span>
                    <span><b>{venue.total_events_hosted || 0}</b> hosted</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal Dialogs */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h3>
                {modal.type === "addEvent" && "Create New Campus Event"}
                {modal.type === "editEvent" && "Edit Campus Event"}
                {modal.type === "addClub" && "Register New Club"}
                {modal.type === "addVenue" && "Add Campus Venue"}
                {modal.type === "eventStudents" && `Registered Students — ${modal.event?.title}`}
                {modal.type === "eventFeedback" && `Participant Reviews — ${modal.event?.title}`}
              </h3>
              <button className="icon-btn" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Add/Edit Event */}
            {(modal.type === "addEvent" || modal.type === "editEvent") && (
              <EventFormModal
                event={modal.event}
                clubs={clubs}
                venues={venues}
                onSave={(data) =>
                  modal.type === "addEvent"
                    ? handleCreateEvent(data)
                    : handleUpdateEvent(modal.event.id, data)
                }
                onCancel={() => setModal(null)}
              />
            )}

            {/* Modal Body: Add Club */}
            {modal.type === "addClub" && (
              <ClubFormModal onSave={handleCreateClub} onCancel={() => setModal(null)} />
            )}

            {/* Modal Body: Add Venue */}
            {modal.type === "addVenue" && (
              <VenueFormModal onSave={handleCreateVenue} onCancel={() => setModal(null)} />
            )}

            {/* Modal Body: Registrations & Attendance Roster */}
            {modal.type === "eventStudents" && (
              <div style={{ padding: "16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    Total Registered: <b>{eventRegistrations.length} students</b>
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-sm" onClick={() => handleBulkAttendance("present")}>
                      Mark All Present
                    </button>
                    <button className="btn-sm" onClick={() => handleBulkAttendance("absent")}>
                      Reset All
                    </button>
                  </div>
                </div>

                {eventRegistrations.length === 0 ? (
                  <p style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No students have registered for this event yet.
                  </p>
                ) : (
                  <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "var(--text-muted)" }}>
                          <th style={{ padding: "8px" }}>Roll No</th>
                          <th style={{ padding: "8px" }}>Student</th>
                          <th style={{ padding: "8px" }}>Dept & Year</th>
                          <th style={{ padding: "8px" }}>Status</th>
                          <th style={{ padding: "8px", textAlign: "right" }}>Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventRegistrations.map((student) => (
                          <tr key={student.registration_id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "10px 8px" }}><b>{student.roll_no || "N/A"}</b></td>
                            <td style={{ padding: "10px 8px" }}>
                              <div>{student.name}</div>
                              <small style={{ color: "var(--text-muted)" }}>{student.email}</small>
                            </td>
                            <td style={{ padding: "10px 8px" }}>{student.department} (Year {student.year || "3"})</td>
                            <td style={{ padding: "10px 8px" }}>
                              <span className="badge badge-success">Registered</span>
                            </td>
                            <td style={{ padding: "10px 8px", textAlign: "right" }}>
                              <button
                                className={`btn-sm ${student.attendance_status === "present" ? "primary" : ""}`}
                                onClick={() => handleToggleAttendance(student.registration_id, student.attendance_status)}
                              >
                                {student.attendance_status === "present" ? "Present ✓" : "Mark Present"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Modal Body: Feedback & Reviews */}
            {modal.type === "eventFeedback" && (
              <div style={{ padding: "16px 0" }}>
                <div style={{ display: "flex", gap: "24px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>
                      {eventFeedbackData?.summary?.average_rating || "0.0"}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Average Rating</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>
                      {eventFeedbackData?.summary?.total_reviews || 0} Reviews Received
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      Verified ratings from attendees
                    </div>
                  </div>
                </div>

                <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {eventFeedbackData?.reviews?.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                      No reviews submitted for this event yet.
                    </p>
                  ) : (
                    eventFeedbackData?.reviews?.map((fb) => (
                      <div key={fb.id} style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontWeight: "600", fontSize: "13px" }}>
                            {fb.student_name} ({fb.student_department})
                          </span>
                          <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: "2px", fontSize: "13px" }}>
                            <Star size={13} fill="#f59e0b" /> {fb.rating}/5
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                          {fb.comment || "No written review provided."}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Form Component for Event
function EventFormModal({ event, clubs, venues, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: event?.title || "",
    category: event?.category || "Technical",
    description: event?.description || "",
    event_date: event?.event_date || "",
    start_time: event?.start_time?.slice(0, 5) || "10:00",
    end_time: event?.end_time?.slice(0, 5) || "16:00",
    registration_deadline: event?.registration_deadline || "",
    capacity: event?.capacity || 100,
    club_id: event?.club_id || (clubs[0]?.id || ""),
    venue_id: event?.venue_id || (venues[0]?.id || ""),
    status: event?.status || "upcoming"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Event Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. CSE Tech Fest 2026"
          required
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Academic">Academic</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Event Date</label>
          <input
            type="date"
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Capacity Limit</label>
          <input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            required
            min="10"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Start Time</label>
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>End Time</label>
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Organizing Club</label>
          <select
            value={form.club_id}
            onChange={(e) => setForm({ ...form, club_id: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Venue</label>
          <select
            value={form.venue_id}
            onChange={(e) => setForm({ ...form, venue_id: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name} ({v.capacity} seats)</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Detailed description of the campus event..."
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
        <button type="button" className="btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">Save Event</button>
      </div>
    </form>
  );
}

// Modal Form for Club
function ClubFormModal({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", description: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Club Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Robotics & AI Club"
          required
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Goals, activities, and coordinator details..."
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
        <button type="button" className="btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">Save Club</button>
      </div>
    </form>
  );
}

// Modal Form for Venue
function VenueFormModal({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", location: "", capacity: 150 });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Venue Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Newton Auditorium"
          required
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Location Details</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="e.g. Science Block, 3rd Floor"
          required
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px" }}>Seating Capacity</label>
        <input
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) })}
          required
          min="10"
          style={{ width: "100%", padding: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
        <button type="button" className="btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">Save Venue</button>
      </div>
    </form>
  );
}