const router = require("express").Router();
const controller = require("../controllers/statsController");

router.get("/dashboard", controller.getDashboardStats);

module.exports = router;
