const db = require("../config/db");

exports.getClubs = async (req, res, next) => {
  try {
    const [clubs] = await db.query(
      `SELECT 
        c.*,
        u.name AS coordinator_name,
        u.email AS coordinator_email,
        COUNT(DISTINCT e.id) AS total_events,
        COUNT(DISTINCT r.id) AS total_registrations
      FROM clubs c
      LEFT JOIN users u ON c.coordinator_id = u.id
      LEFT JOIN events e ON c.id = e.club_id
      LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'registered'
      GROUP BY c.id
      ORDER BY c.name ASC`
    );
    res.json(clubs);
  } catch (error) {
    next(error);
  }
};

exports.getClubById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [clubs] = await db.query(
      `SELECT c.*, u.name AS coordinator_name, u.email AS coordinator_email
       FROM clubs c
       LEFT JOIN users u ON c.coordinator_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    const [events] = await db.query(
      `SELECT e.*, v.name AS venue_name
       FROM events e
       LEFT JOIN venues v ON e.venue_id = v.id
       WHERE e.club_id = ?
       ORDER BY e.event_date DESC`,
      [id]
    );

    res.json({
      ...clubs[0],
      events
    });
  } catch (error) {
    next(error);
  }
};

exports.createClub = async (req, res, next) => {
  try {
    const { name, description, coordinator_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Club name is required." });
    }

    const [result] = await db.query(
      "INSERT INTO clubs (name, description, coordinator_id) VALUES (?, ?, ?)",
      [name.trim(), description ? description.trim() : null, coordinator_id || req.user.id]
    );

    const [created] = await db.query("SELECT * FROM clubs WHERE id = ?", [result.insertId]);

    res.status(201).json({
      message: "Club created successfully.",
      club: created[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, coordinator_id } = req.body;

    const [existing] = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    await db.query(
      `UPDATE clubs SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        coordinator_id = COALESCE(?, coordinator_id)
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        description !== undefined ? description : null,
        coordinator_id !== undefined ? coordinator_id : null,
        id
      ]
    );

    const [updated] = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);

    res.json({
      message: "Club updated successfully.",
      club: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteClub = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    await db.query("DELETE FROM clubs WHERE id = ?", [id]);

    res.json({ message: "Club deleted successfully." });
  } catch (error) {
    next(error);
  }
};
