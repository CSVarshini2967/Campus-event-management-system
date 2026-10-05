const db = require("../config/db");

exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, c.name AS club_name, v.name AS venue_name
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      ORDER BY e.event_date ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.getEventById = async (req, res) => {
  res.json({ message: "Get single event - implement here" });
};

exports.createEvent = async (req, res) => {
  // TODO: validate body and INSERT event
  res.json({ message: "Create event - implement here" });
};

exports.updateEvent = async (req, res) => {
  // TODO: UPDATE event
  res.json({ message: "Update event - implement here" });
};

exports.deleteEvent = async (req, res) => {
  // TODO: DELETE event
  res.json({ message: "Delete event - implement here" });
};
