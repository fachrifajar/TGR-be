import express from "express";
const router = express.Router();
const controller = require("../controller/auth");
// const middleware = require("../middleware/auth");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify", controller.verify);
router.post("/resend-verification", controller.resendVerification);
router.post("/reset-email-sendUrl", controller.sendResetUrl);
router.patch("/reset-email", controller.resetPwd);
router.get("/refresh", controller.refreshToken);

module.exports = router;
