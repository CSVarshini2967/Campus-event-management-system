const router = require("express").Router();
const { body } = require("express-validator");
const eventController = require("../controllers/eventController");
const registrationController = require("../controllers/registrationController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const validate = require("../middleware/validate");

const eventValidation = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("event_date").isISO8601().withMessage("Valid event date (YYYY-MM-DD) is required"),
  body("start_time").notEmpty().withMessage("Start time is required"),
  body("end_time").notEmpty().withMessage("End time is required"),
  validate
];

// Public / Semi-public event listing
router.get("/", eventController.getEvents);
router.get("/:id", optionalAuth, eventController.getEventById);

// Event registration shortcuts
router.post("/:id/register", verifyToken, authorizeRoles("student"), registrationController.registerForEvent);
router.delete("/:id/register", verifyToken, authorizeRoles("student"), registrationController.cancelRegistration);
router.get(
  "/:id/registrations",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  registrationController.getRegisteredStudents
);

// Organiser and Admin CRUD
router.post(
  "/",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  eventValidation,
  eventController.createEvent
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  eventController.updateEvent
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("organiser", "admin"),
  eventController.deleteEvent
);

module.exports = router;
