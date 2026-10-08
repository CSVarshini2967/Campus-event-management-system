const db = require("../config/db");

exports.getVenues = async (req, res, next) => {
  try {
    const [venues] = await db.query(
      `SELECT 
        v.*,
        COUNT(DISTINCT e.id) AS total_events_hosted
      FROM venues v
      LEFT JOIN events e ON v.id = e.venue_id
      GROUP BY v.id
      ORDER BY v.name ASC`
    );
    res.json(venues);
  } catch (error) {
    next(error);
  }
};

exports.getVenueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [venues] = await db.query("SELECT * FROM venues WHERE id = ?", [id]);

    if (venues.length === 0) {
      return res.status(404).json({ message: "Venue not found." });
    }

    const [events] = await db.query(
      `SELECT id, title, event_date, start_time, end_time, status
       FROM events
       WHERE venue_id = ? AND status != 'cancelled'
       ORDER BY event_date ASC, start_time ASC`,
      [id]
    );

    res.json({
      ...venues[0],
      events
    });
  } catch (error) {
    next(error);
  }
};

exports.createVenue = async (req, res, next) => {
  try {
    const { name, location, capacity } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Venue name is required." });
    }

    const [result] = await db.query(
      "INSERT INTO venues (name, location, capacity) VALUES (?, ?, ?)",
      [name.trim(), location ? location.trim() : null, capacity ? parseInt(capacity, 10) : 100]
    );

    const [created] = await db.query("SELECT * FROM venues WHERE id = ?", [result.insertId]);

    res.status(201).json({
      message: "Venue created successfully.",
      venue: created[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    const [existing] = await db.query("SELECT * FROM venues WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Venue not found." });
    }

    await db.query(
      `UPDATE venues SET
        name = COALESCE(?, name),
        location = COALESCE(?, location),
        capacity = COALESCE(?, capacity)
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        location !== undefined ? location : null,
        capacity ? parseInt(capacity, 10) : null,
        id
      ]
    );

    const [updated] = await db.query("SELECT * FROM venues WHERE id = ?", [id]);

    res.json({
      message: "Venue updated successfully.",
      venue: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM venues WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Venue not found." });
    }

    await db.query("DELETE FROM venues WHERE id = ?", [id]);

    res.json({ message: "Venue deleted successfully." });
  } catch (error) {
    next(error);
  }
};
