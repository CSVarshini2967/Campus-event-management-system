const db = require("../config/db");

// Submit or update feedback for an event
exports.submitFeedback = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const studentId = req.user.id;
    const { rating, comment } = req.body;

    const numRating = parseInt(rating, 10);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    // Check if student was registered for this event
    const [registration] = await db.query(
      "SELECT id, status FROM registrations WHERE student_id = ? AND event_id = ?",
      [studentId, eventId]
    );

    if (registration.length === 0 || registration[0].status !== "registered") {
      return res.status(403).json({
        message: "You can only provide feedback for events you have registered for."
      });
    }

    // Insert or update feedback (1 feedback per student per event)
    await db.query(
      `INSERT INTO feedback (student_id, event_id, rating, comment, submitted_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         rating = VALUES(rating),
         comment = VALUES(comment),
         submitted_at = CURRENT_TIMESTAMP`,
      [studentId, eventId, numRating, comment ? comment.trim() : ""]
    );

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    next(error);
  }
};

// Get feedback summary & list for an event
exports.getEventFeedback = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const [reviews] = await db.query(
      `SELECT 
        f.id,
        f.rating,
        f.comment,
        f.submitted_at,
        u.name AS student_name,
        u.department AS student_department
      FROM feedback f
      JOIN users u ON f.student_id = u.id
      WHERE f.event_id = ?
      ORDER BY f.submitted_at DESC`,
      [eventId]
    );

    const [stats] = await db.query(
      `SELECT 
        COUNT(id) AS total_reviews,
        COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating
      FROM feedback
      WHERE event_id = ?`,
      [eventId]
    );

    res.json({
      summary: stats[0],
      reviews
    });
  } catch (error) {
    next(error);
  }
};
