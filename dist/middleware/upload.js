"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const MB = 2;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;
const filesPayLoadExist = (req, res, next) => {
    try {
        if (!req.files) {
            throw { code: 400, message: "Missing files" };
        }
        next();
    }
    catch (error) {
        res.status(error?.code ?? 500).json({
            message: error,
        });
    }
};
const fileSizeLimiter = (req, res, next) => {
    try {
        if (!req.files) {
            next();
        }
        else {
            const files = req.files;
            const filesOverLimit = [];
            Object.keys(files).forEach((key) => {
                if (files[key].size > FILE_SIZE_LIMIT) {
                    filesOverLimit.push(files[key].name);
                }
            });
            if (filesOverLimit.length) {
                const properVerb = filesOverLimit.length > 1 ? "are" : "is";
                const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(",", ", ");
                const message = filesOverLimit.length < 3
                    ? sentence.replace(",", " and")
                    : sentence.replace(/,(?=[^,]*$)/, " and");
                throw { code: 413, message };
            }
            next();
        }
    }
    catch (error) {
        res.status(error?.code ?? 500).json({
            message: error,
        });
    }
};
const fileExtLimiter = (allowedExtArray) => {
    return async (req, res, next) => {
        if (!req.files) {
            next();
        }
        else {
            const files = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files);
            const fileExtensions = [];
            files.forEach((file) => {
                if (Array.isArray(file)) {
                    file.forEach((f) => {
                        fileExtensions.push(path.extname(f.name));
                    });
                }
                else {
                    fileExtensions.push(path.extname(file.name));
                }
            });
            // Are the file extensions allowed?
            const allowed = fileExtensions.every((ext) => allowedExtArray.includes(ext));
            if (!allowed) {
                const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");
                res.status(422).json({ status: "error", message });
                return;
            }
            next();
        }
    };
};
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = {
    filesPayLoadExist,
    fileSizeLimiter,
    fileExtLimiter,
    cloudinary,
};
//# sourceMappingURL=upload.js.map