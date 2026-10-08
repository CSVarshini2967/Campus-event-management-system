const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_jwt_key_for_campus_events_2026"
    );

    const [users] = await db.query(
      "SELECT id, name, email, role, roll_no, department, year FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ message: "User belonging to this token no longer exists." });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid authentication token." });
  }
};

module.exports = verifyToken;
