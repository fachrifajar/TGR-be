import express from "express";
const router = express.Router();
const { addPost } = require("../controller/post");
const { validateToken } = require("../middleware/auth");
const middlewareUpload = require("../middleware/upload");

router.post(
  "/add",
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
  addPost
);

module.exports = router;
