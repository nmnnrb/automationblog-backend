const express = require("express");
const authController = require("../controllers/authController/auth");
const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signUp);
router.get("/logincheck", authController.check);

module.exports = router;
