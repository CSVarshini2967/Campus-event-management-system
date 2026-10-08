const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "super_secret_jwt_key_for_campus_events_2026",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, roll_no, department, year } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Role assignment rules: default is student.
    // If role is admin, ensure the requesting user is already an admin.
    let assignedRole = "student";
    if (role === "organiser") {
      assignedRole = "organiser";
    } else if (role === "admin") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Only an existing administrator can create admin accounts." });
      }
      assignedRole = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password, role, roll_no, department, year)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        assignedRole,
        roll_no ? roll_no.trim() : null,
        department ? department.trim() : null,
        year ? parseInt(year, 10) : null
      ]
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: normalizedEmail,
      role: assignedRole,
      roll_no: roll_no || null,
      department: department || null,
      year: year ? parseInt(year, 10) : null
    };

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await db.query(
      "SELECT id, name, email, password, role, roll_no, department, year FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roll_no: user.roll_no,
      department: user.department,
      year: user.year
    };

    const token = generateToken(sanitizedUser);

    res.json({
      message: "Login successful.",
      token,
      user: sanitizedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
