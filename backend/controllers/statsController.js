const db = require("../config/db");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total events & status breakdown
    const [eventCounts] = await db.query(`
      SELECT 
        COUNT(*) AS total_events,
        SUM(CASE WHEN status = 'upcoming' OR (status = 'published' AND event_date >= ?) THEN 1 ELSE 0 END) AS upcoming_events,
        SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing_events,
        SUM(CASE WHEN status = 'completed' OR (status = 'published' AND event_date < ?) THEN 1 ELSE 0 END) AS completed_events,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_events
      FROM events
    `, [today, today]);

    // Registrations count
    const [regCounts] = await db.query(`
      SELECT 
        COUNT(*) AS total_registrations,
        SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) AS active_registrations,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_registrations
      FROM registrations
    `);

    // Attendance stats
    const [attCounts] = await db.query(`
      SELECT 
        COUNT(*) AS total_marked,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_count
      FROM attendance
    `);

    const totalMarked = attCounts[0].total_marked || 0;
    const presentCount = attCounts[0].present_count || 0;
    const attendancePercentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

    // Clubs & venues counts
    const [clubCount] = await db.query("SELECT COUNT(*) AS total_clubs FROM clubs");
    const [venueCount] = await db.query("SELECT COUNT(*) AS total_venues FROM venues");
    const [userCount] = await db.query("SELECT COUNT(*) AS total_students FROM users WHERE role = 'student'");

    // Category distribution
    const [categoryDistribution] = await db.query(`
      SELECT category, COUNT(*) as count 
      FROM events 
      GROUP BY category 
      ORDER BY count DESC
    `);

    // Top upcoming events
    const [upcomingEvents] = await db.query(`
      SELECT 
        e.id, e.title, e.category, e.event_date, e.start_time, e.end_time, e.capacity,
        c.name AS club_name, v.name AS venue_name,
        COUNT(r.id) AS registered_count
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'registered'
      WHERE e.event_date >= ? AND e.status != 'cancelled'
      GROUP BY e.id
      ORDER BY e.event_date ASC
      LIMIT 5
    `, [today]);

    res.json({
      events: {
        total: eventCounts[0].total_events || 0,
        upcoming: eventCounts[0].upcoming_events || 0,
        ongoing: eventCounts[0].ongoing_events || 0,
        completed: eventCounts[0].completed_events || 0,
        cancelled: eventCounts[0].cancelled_events || 0
      },
      registrations: {
        total: regCounts[0].total_registrations || 0,
        active: regCounts[0].active_registrations || 0,
        cancelled: regCounts[0].cancelled_registrations || 0
      },
      attendance: {
        totalMarked,
        present: presentCount,
        percentage: attendancePercentage
      },
      clubs: clubCount[0].total_clubs || 0,
      venues: venueCount[0].total_venues || 0,
      students: userCount[0].total_students || 0,
      categories: categoryDistribution,
      upcomingEvents
    });
  } catch (error) {
    next(error);
  }
};
