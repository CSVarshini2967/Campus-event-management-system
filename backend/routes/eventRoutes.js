const router = require("express").Router();
const controller = require("../controllers/eventController");

router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);
router.post("/", controller.createEvent);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;
