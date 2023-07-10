import express from "express";
const router = express.Router();
const { getProfile } = require("../controller/profile");
const { validateToken } = require("../middleware/auth");

router.get("/", validateToken, getProfile);

module.exports = router;
