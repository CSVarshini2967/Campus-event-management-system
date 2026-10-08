const db = require("../config/db");

// Mark single or bulk attendance
exports.markAttendance = async (req, res, next) => {
  try {
    const { event_id, records } = req.body;
    // records: Array of { registration_id, status: 'present'|'absent' } or single { registration_id, status }

    let items = [];
    if (Array.isArray(records)) {
      items = records;
    } else if (req.body.registration_id) {
      items = [{ registration_id: req.body.registration_id, status: req.body.status || "present" }];
    } else {
      return res.status(400).json({ message: "Invalid attendance data. Expected 'records' array or 'registration_id'." });
    }

    if (items.length === 0) {
      return res.status(400).json({ message: "No attendance records provided." });
    }

    // Process each item
    for (const item of items) {
      const { registration_id, status } = item;
      const attStatus = status === "present" ? "present" : "absent";
      const markedAt = attStatus === "present" ? new Date() : null;

      await db.query(
        `INSERT INTO attendance (registration_id, status, marked_at)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           status = VALUES(status),
           marked_at = VALUES(marked_at)`,
        [registration_id, attStatus, markedAt]
      );
    }

    res.json({
      message: `Attendance marked successfully for ${items.length} record(s).`
    });
  } catch (error) {
    next(error);
  }
};

// Student view of their own attendance history
exports.getMyAttendance = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const [attendanceList] = await db.query(
      `SELECT 
        a.id AS attendance_id,
        a.status AS attendance_status,
        a.marked_at,
        r.id AS registration_id,
        r.registered_at,
        e.id AS event_id,
        e.title AS event_title,
        e.event_date,
        e.start_time,
        e.end_time,
        c.name AS club_name,
        v.name AS venue_name
      FROM attendance a
      JOIN registrations r ON a.registration_id = r.id
      JOIN events e ON r.event_id = e.id
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE r.student_id = ?
      ORDER BY e.event_date DESC`,
      [studentId]
    );

    res.json(attendanceList);
  } catch (error) {
    next(error);
  }
};

// Organiser/Admin view of attendance for an event
exports.getEventAttendance = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const [list] = await db.query(
      `SELECT 
        r.id AS registration_id,
        r.registered_at,
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email,
        u.roll_no,
        u.department,
        u.year,
        COALESCE(a.status, 'absent') AS attendance_status,
        a.marked_at
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      LEFT JOIN attendance a ON r.id = a.registration_id
      WHERE r.event_id = ? AND r.status = 'registered'
      ORDER BY u.roll_no ASC, u.name ASC`,
      [eventId]
    );

    res.json(list);
  } catch (error) {
    next(error);
  }
};
