const db = require("../config/db");

// Helper to check venue availability/overlap
const isVenueConflict = async (venueId, eventDate, startTime, endTime, excludeEventId = null) => {
  let query = `
    SELECT id, title, start_time, end_time
    FROM events
    WHERE venue_id = ?
      AND event_date = ?
      AND status != 'cancelled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
  `;
  const params = [venueId, eventDate, startTime, startTime, endTime, endTime, startTime, endTime];

  if (excludeEventId) {
    query += " AND id != ?";
    params.push(excludeEventId);
  }

  const [conflicts] = await db.query(query, params);
  return conflicts.length > 0 ? conflicts[0] : null;
};

exports.getEvents = async (req, res, next) => {
  try {
    const { search, category, status, date, club_id, venue_id } = req.query;

    let query = `
      SELECT 
        e.*,
        c.name AS club_name,
        v.name AS venue_name,
        v.location AS venue_location,
        v.capacity AS venue_capacity,
        u.name AS creator_name,
        COUNT(DISTINCT r.id) AS total_registrations,
        ROUND(AVG(f.rating), 1) AS avg_rating,
        COUNT(DISTINCT f.id) AS total_feedback
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'registered'
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND (e.title LIKE ? OR e.description LIKE ? OR c.name LIKE ? OR v.name LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category && category !== "All") {
      query += ` AND e.category = ?`;
      params.push(category);
    }

    if (status && status !== "All") {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    if (date) {
      query += ` AND e.event_date = ?`;
      params.push(date);
    }

    if (club_id) {
      query += ` AND e.club_id = ?`;
      params.push(club_id);
    }

    if (venue_id) {
      query += ` AND e.venue_id = ?`;
      params.push(venue_id);
    }

    query += `
      GROUP BY e.id
      ORDER BY e.event_date ASC, e.start_time ASC
    `;

    const [events] = await db.query(query, params);

    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [events] = await db.query(
      `SELECT 
        e.*,
        c.name AS club_name,
        c.description AS club_description,
        v.name AS venue_name,
        v.location AS venue_location,
        v.capacity AS venue_capacity,
        u.name AS creator_name,
        u.email AS creator_email,
        COUNT(DISTINCT r.id) AS total_registrations,
        ROUND(AVG(f.rating), 1) AS avg_rating,
        COUNT(DISTINCT f.id) AS total_feedback
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'registered'
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.id = ?
      GROUP BY e.id`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const event = events[0];

    // If user is authenticated, check if they are registered or submitted feedback
    let isUserRegistered = false;
    let userFeedback = null;
    let userAttendance = null;

    if (req.user) {
      const [reg] = await db.query(
        `SELECT r.id, r.status, a.status AS attendance_status
         FROM registrations r
         LEFT JOIN attendance a ON r.id = a.registration_id
         WHERE r.student_id = ? AND r.event_id = ? AND r.status = 'registered'`,
        [req.user.id, id]
      );
      if (reg.length > 0) {
        isUserRegistered = true;
        userAttendance = reg[0].attendance_status || "absent";
      }

      const [fb] = await db.query(
        "SELECT id, rating, comment, submitted_at FROM feedback WHERE student_id = ? AND event_id = ?",
        [req.user.id, id]
      );
      if (fb.length > 0) {
        userFeedback = fb[0];
      }
    }

    res.json({
      ...event,
      isUserRegistered,
      userAttendance,
      userFeedback
    });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      event_date,
      start_time,
      end_time,
      registration_deadline,
      capacity,
      club_id,
      venue_id,
      status
    } = req.body;

    // Check venue double-booking if venue is assigned
    if (venue_id) {
      const conflict = await isVenueConflict(venue_id, event_date, start_time, end_time);
      if (conflict) {
        return res.status(409).json({
          message: `Venue conflict: "${conflict.title}" is already scheduled at this venue on ${event_date} (${conflict.start_time} - ${conflict.end_time}).`
        });
      }
    }

    const eventStatus = status || "upcoming";
    const eventCapacity = capacity ? parseInt(capacity, 10) : 100;

    const [result] = await db.query(
      `INSERT INTO events 
       (title, description, category, event_date, start_time, end_time, registration_deadline, capacity, club_id, venue_id, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description ? description.trim() : null,
        category,
        event_date,
        start_time,
        end_time,
        registration_deadline || null,
        eventCapacity,
        club_id || null,
        venue_id || null,
        req.user.id,
        eventStatus
      ]
    );

    const [created] = await db.query(
      `SELECT e.*, c.name AS club_name, v.name AS venue_name
       FROM events e
       LEFT JOIN clubs c ON e.club_id = c.id
       LEFT JOIN venues v ON e.venue_id = v.id
       WHERE e.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Event created successfully.",
      event: created[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      event_date,
      start_time,
      end_time,
      registration_deadline,
      capacity,
      club_id,
      venue_id,
      status
    } = req.body;

    const [existing] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const currentEvent = existing[0];

    // Ownership check: organisers can only edit their own created events, admins can edit all
    if (req.user.role === "organiser" && currentEvent.created_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only edit events created by you." });
    }

    const targetVenueId = venue_id !== undefined ? venue_id : currentEvent.venue_id;
    const targetDate = event_date || currentEvent.event_date;
    const targetStart = start_time || currentEvent.start_time;
    const targetEnd = end_time || currentEvent.end_time;

    if (targetVenueId) {
      const conflict = await isVenueConflict(targetVenueId, targetDate, targetStart, targetEnd, id);
      if (conflict) {
        return res.status(409).json({
          message: `Venue conflict: "${conflict.title}" is already scheduled at this venue on ${targetDate} (${conflict.start_time} - ${conflict.end_time}).`
        });
      }
    }

    await db.query(
      `UPDATE events SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        event_date = COALESCE(?, event_date),
        start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time),
        registration_deadline = COALESCE(?, registration_deadline),
        capacity = COALESCE(?, capacity),
        club_id = COALESCE(?, club_id),
        venue_id = COALESCE(?, venue_id),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        description !== undefined ? description : null,
        category || null,
        event_date || null,
        start_time || null,
        end_time || null,
        registration_deadline !== undefined ? registration_deadline : null,
        capacity ? parseInt(capacity, 10) : null,
        club_id !== undefined ? club_id : null,
        venue_id !== undefined ? venue_id : null,
        status || null,
        id
      ]
    );

    const [updated] = await db.query(
      `SELECT e.*, c.name AS club_name, v.name AS venue_name
       FROM events e
       LEFT JOIN clubs c ON e.club_id = c.id
       LEFT JOIN venues v ON e.venue_id = v.id
       WHERE e.id = ?`,
      [id]
    );

    res.json({
      message: "Event updated successfully.",
      event: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const currentEvent = existing[0];

    // Ownership check: organisers can only delete their own created events, admins can delete all
    if (req.user.role === "organiser" && currentEvent.created_by !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only delete events created by you." });
    }

    await db.query("DELETE FROM events WHERE id = ?", [id]);

    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    next(error);
  }
};
