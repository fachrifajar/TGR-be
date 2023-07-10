import express from "express";
const router = express.Router();
const { getProfile, editProfile } = require("../controller/profile");
const { validateToken } = require("../middleware/auth");
const middlewareUpload = require("../middleware/upload");

router.get("/", validateToken, getProfile);
router.patch(
  "/edit",
  validateToken,
  middlewareUpload.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
  ]),
  middlewareUpload.fileSizeLimiter,
  editProfile
);

module.exports = router;
