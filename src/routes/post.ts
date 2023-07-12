import express from "express";
const router = express.Router();
const { addPost, editPost, editSave } = require("../controller/post");
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
  editPost
);

router.post("/edit-save", validateToken, editSave);

module.exports = router;
