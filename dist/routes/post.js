"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { addPost, editPost, editSave, getPost, deletePost, incrementViewCount, getMyPost, } = require("../controller/post");
const { validateToken } = require("../middleware/auth");
const middlewareUpload = require("../middleware/upload");
const rateLimit_1 = __importDefault(require("../middleware/rateLimit"));
router.post("/add", validateToken, middlewareUpload.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
]), middlewareUpload.fileSizeLimiter, addPost);
router.patch("/edit", validateToken, middlewareUpload.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
]), middlewareUpload.fileSizeLimiter, editPost);
router.patch("/incrementViewCount/:id", rateLimit_1.default, incrementViewCount);
router.post("/edit-save", validateToken, editSave);
router.delete("/delete/:id", validateToken, deletePost);
router.get("/:key?", getPost);
router.get("/personalPost/byid", validateToken, getMyPost);
module.exports = router;
//# sourceMappingURL=post.js.map