"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getProfile, editProfile, deletePicture, } = require("../controller/profile");
const { validateToken } = require("../middleware/auth");
const middlewareUpload = require("../middleware/upload");
router.get("/", validateToken, getProfile);
router.patch("/edit", validateToken, middlewareUpload.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
]), middlewareUpload.fileSizeLimiter, editProfile);
router.delete("/images/delete", validateToken, deletePicture);
module.exports = router;
//# sourceMappingURL=profile.js.map