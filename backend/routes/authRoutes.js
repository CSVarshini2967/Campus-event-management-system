const router = require("express").Router();
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  validate
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", verifyToken, getMe);

module.exports = router;
