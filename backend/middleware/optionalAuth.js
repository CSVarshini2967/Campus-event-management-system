const jwt = require("jsonwebtoken");
const db = require("../config/db");

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_jwt_key_for_campus_events_2026"
      );
      const [users] = await db.query(
        "SELECT id, name, email, role, roll_no, department, year FROM users WHERE id = ?",
        [decoded.id]
      );
      if (users.length > 0) {
        req.user = users[0];
      }
    }
  } catch (err) {
    // If token is invalid or expired in optional auth, proceed as unauthenticated
    req.user = null;
  }
  next();
};

module.exports = optionalAuth;
