const router = require("express").Router();
const controller = require("../controllers/feedbackController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Student submits feedback
router.post("/:eventId", verifyToken, authorizeRoles("student"), controller.submitFeedback);

// View feedback for an event
router.get("/event/:eventId", controller.getEventFeedback);

module.exports = router;
