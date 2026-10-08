const router = require("express").Router();
const controller = require("../controllers/venueController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", controller.getVenues);
router.get("/:id", controller.getVenueById);

router.post("/", verifyToken, authorizeRoles("organiser", "admin"), controller.createVenue);
router.put("/:id", verifyToken, authorizeRoles("organiser", "admin"), controller.updateVenue);
router.delete("/:id", verifyToken, authorizeRoles("admin"), controller.deleteVenue);

module.exports = router;
