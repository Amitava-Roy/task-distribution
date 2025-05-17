const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signUp", authController.signUP);
router.post("/signIn", authController.signIn);
// router.post("/forget-password", authController.forgetPassword);
// router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
