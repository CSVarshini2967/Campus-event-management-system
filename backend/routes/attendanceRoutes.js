const router = require("express").Router();
const controller = require("../controllers/attendanceController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Student routes
router.get("/my", verifyToken, authorizeRoles("student"), controller.getMyAttendance);

// Organiser / Admin routes
router.post(
  "/mark",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  controller.markAttendance
);

router.get(
  "/event/:eventId",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  controller.getEventAttendance
);

module.exports = router;
