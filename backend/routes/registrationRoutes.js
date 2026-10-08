const router = require("express").Router();
const controller = require("../controllers/registrationController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Student registration routes
router.get("/my", verifyToken, authorizeRoles("student"), controller.getMyEvents);
router.get("/my-events", verifyToken, authorizeRoles("student"), controller.getMyEvents);
router.post("/:eventId", verifyToken, authorizeRoles("student"), controller.registerForEvent);
router.delete("/:eventId", verifyToken, authorizeRoles("student"), controller.cancelRegistration);

// Organiser / Admin routes
router.get(
  "/event/:eventId/students",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  controller.getRegisteredStudents
);

module.exports = router;
