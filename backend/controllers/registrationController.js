const db = require("../config/db");

exports.registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.params.eventId;
    const studentId = req.user.id;

    // 1. Fetch event details
    const [events] = await db.query(
      `SELECT e.*, COUNT(r.id) AS current_registrations
       FROM events e
       LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'registered'
       WHERE e.id = ?
       GROUP BY e.id`,
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const event = events[0];

    // Check event status
    if (event.status === "cancelled") {
      return res.status(400).json({ message: "This event has been cancelled." });
    }
    if (event.status === "completed") {
      return res.status(400).json({ message: "This event has already ended." });
    }

    // Check registration deadline if provided
    if (event.registration_deadline) {
      const today = new Date().toISOString().split("T")[0];
      if (today > event.registration_deadline) {
        return res.status(400).json({ message: `Registration closed on ${event.registration_deadline}.` });
      }
    }

    // Check capacity
    if (event.capacity && event.current_registrations >= event.capacity) {
      return res.status(400).json({ message: "Registration failed. This event is currently at full capacity." });
    }

    // Check existing registration
    const [existing] = await db.query(
      "SELECT id, status FROM registrations WHERE student_id = ? AND event_id = ?",
      [studentId, eventId]
    );

    if (existing.length > 0) {
      if (existing[0].status === "registered") {
        return res.status(400).json({ message: "You are already registered for this event." });
      }
      // If previously cancelled, re-register
      await db.query(
        "UPDATE registrations SET status = 'registered', registered_at = CURRENT_TIMESTAMP WHERE id = ?",
        [existing[0].id]
      );
      return res.json({
        message: "Successfully re-registered for the event.",
        registrationId: existing[0].id
      });
    }

    // Insert new registration
    const [result] = await db.query(
      "INSERT INTO registrations (student_id, event_id, status) VALUES (?, ?, 'registered')",
      [studentId, eventId]
    );

    res.status(201).json({
      message: "Successfully registered for the event.",
      registrationId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.params.eventId;
    const studentId = req.user.id;

    const [existing] = await db.query(
      "SELECT id, status FROM registrations WHERE student_id = ? AND event_id = ?",
      [studentId, eventId]
    );

    if (existing.length === 0 || existing[0].status === "cancelled") {
      return res.status(400).json({ message: "You do not have an active registration for this event." });
    }

    await db.query(
      "UPDATE registrations SET status = 'cancelled' WHERE id = ?",
      [existing[0].id]
    );

    res.json({ message: "Registration cancelled successfully." });
  } catch (error) {
    next(error);
  }
};

exports.getMyEvents = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const [myEvents] = await db.query(
      `SELECT 
        r.id AS registration_id,
        r.status AS registration_status,
        r.registered_at,
        e.id AS event_id,
        e.title,
        e.description,
        e.category,
        e.event_date,
        e.start_time,
        e.end_time,
        e.status AS event_status,
        c.name AS club_name,
        v.name AS venue_name,
        v.location AS venue_location,
        a.status AS attendance_status,
        a.marked_at AS attendance_marked_at,
        f.rating AS feedback_rating,
        f.comment AS feedback_comment,
        f.submitted_at AS feedback_submitted_at
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN attendance a ON r.id = a.registration_id
      LEFT JOIN feedback f ON (f.student_id = r.student_id AND f.event_id = e.id)
      WHERE r.student_id = ?
      ORDER BY e.event_date DESC, e.start_time DESC`,
      [studentId]
    );

    res.json(myEvents);
  } catch (error) {
    next(error);
  }
};

exports.getRegisteredStudents = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.params.eventId;

    // If organiser, verify event ownership or admin
    if (req.user.role === "organiser") {
      const [ev] = await db.query("SELECT created_by FROM events WHERE id = ?", [eventId]);
      if (ev.length === 0) return res.status(404).json({ message: "Event not found." });
      if (ev[0].created_by !== req.user.id) {
        return res.status(403).json({ message: "Access denied. You can only view registrations for your own events." });
      }
    }

    const [students] = await db.query(
      `SELECT 
        r.id AS registration_id,
        r.registered_at,
        r.status AS registration_status,
        u.id AS student_id,
        u.name,
        u.email,
        u.roll_no,
        u.department,
        u.year,
        COALESCE(a.status, 'absent') AS attendance_status,
        a.marked_at
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      LEFT JOIN attendance a ON r.id = a.registration_id
      WHERE r.event_id = ? AND r.status = 'registered'
      ORDER BY r.registered_at ASC`,
      [eventId]
    );

    res.json(students);
  } catch (error) {
    next(error);
  }
};
