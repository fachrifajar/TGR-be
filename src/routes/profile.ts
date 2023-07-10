import express from "express";
import { validate } from "uuid";
const router = express.Router();
const {
  getProfile,
  editProfile,
  deletePicture,
} = require("../controller/profile");
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

router.delete("/images/delete", validateToken, deletePicture);

module.exports = router;
