"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = require("../controller/auth");
const middleware = require("../middleware/auth");
const passport = require("passport");
const session = require("express-session");
require("../controller/googleInit");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify", controller.verify);
router.post("/resend-verification", controller.resendVerification);
router.post("/reset-email-sendUrl", controller.sendResetUrl);
router.patch("/reset-email", controller.resetPwd);
router.get("/refresh", controller.refreshToken);
router.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
router.use(passport.initialize());
router.use(passport.session());
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/login",
}));
router.get("/google/failure", middleware.isLoggedIn, controller.googleFailure);
router.get("/protected", middleware.isLoggedIn, controller.googleAuth);
module.exports = router;
//# sourceMappingURL=auth.js.map