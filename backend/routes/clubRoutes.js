const router = require("express").Router();
const controller = require("../controllers/clubController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", controller.getClubs);
router.get("/:id", controller.getClubById);

router.post("/", verifyToken, authorizeRoles("organiser", "admin"), controller.createClub);
router.put("/:id", verifyToken, authorizeRoles("organiser", "admin"), controller.updateClub);
router.delete("/:id", verifyToken, authorizeRoles("admin"), controller.deleteClub);

module.exports = router;
