import express from "express";
const router = express.Router();
const {
  addPost,
  editPost,
  editSave,
  getPost,
  deletePost,
  incrementViewCount,
} = require("../controller/post");
const { validateToken } = require("../middleware/auth");
const middlewareUpload = require("../middleware/upload");
import rateLimitMiddleware from "../middleware/rateLimit";

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

router.patch(
  "/incrementViewCount/:id",
  rateLimitMiddleware,
  incrementViewCount
);

router.post("/edit-save", validateToken, editSave);

router.delete("/delete/:id", validateToken, deletePost);

router.get("/:key?", getPost);

module.exports = router;
