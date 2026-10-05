const router = require("express").Router();
const controller = require("../controllers/registrationController");

router.post("/:eventId", controller.registerForEvent);
router.delete("/:eventId", controller.cancelRegistration);
router.get("/my-events", controller.getMyEvents);
router.get("/event/:eventId/students", controller.getRegisteredStudents);

module.exports = router;
