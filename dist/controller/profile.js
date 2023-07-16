"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const { cloudinary } = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");
const getProfile = async (req, res) => {
    try {
        const getIdToken = req.id;
        const getData = await prisma.user.findUnique({
            where: { id: getIdToken },
            select: {
                profile_picture: true,
                username: true,
                phone_number: true,
                company: true,
                company_picture: true,
                save: true,
            },
        });
        res.status(200).json({
            message: "Success get user profile",
            data: getData,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const editProfile = async (req, res) => {
    try {
        const { username, profile_picture, phone_number } = req.body;
        const getIdToken = req.id;
        const user = await prisma.user.findUnique({
            where: { id: getIdToken },
            select: {
                username: true,
                profile_picture: true,
                phone_number: true,
            },
        });
        const existingProfilePicture = user?.profile_picture;
        const getProfilePicture = req?.files?.profile_picture;
        let profilePictureCloudinary;
        const validateUsername = await prisma.user.findMany({
            where: {
                username,
                NOT: {
                    id: getIdToken,
                },
            },
        });
        if (username && validateUsername.length) {
            return res.status(400).json({ message: "Username is already taken" });
        }
        if (req.files) {
            // Delete existing picture if exist
            if (existingProfilePicture) {
                await cloudinary.v2.uploader.destroy(existingProfilePicture, { folder: "TGR" }, function (error, result) {
                    if (error) {
                        throw error;
                    }
                });
            }
            // Upload new picture
            if (getProfilePicture) {
                await cloudinary.v2.uploader.upload(getProfilePicture.tempFilePath, { public_id: uuidv4(), folder: "TGR" }, async function (error, result) {
                    if (error) {
                        throw error;
                    }
                    profilePictureCloudinary = result?.public_id;
                });
            }
        }
        await prisma.user.update({
            where: { id: getIdToken },
            data: {
                username: username ? username.toLowerCase() : user?.username,
                phone_number: phone_number ? phone_number : user?.phone_number,
                profile_picture: getProfilePicture
                    ? profilePictureCloudinary
                    : user?.profile_picture,
            },
        });
        res.status(200).json({
            message: `Success update profile`,
            data: {
                ...req.body,
                profilePictureCloudinary,
            },
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
const deletePicture = async (req, res) => {
    try {
        const { profile_picture } = req.body;
        const getIdToken = req.id;
        const user = await prisma.user.findUnique({
            where: { id: getIdToken },
            select: {
                profile_picture: true,
            },
        });
        const existingProfilePicture = user?.profile_picture;
        if (!profile_picture)
            return res.status(400).json({ message: "Please pick options to delete" });
        if (profile_picture) {
            await cloudinary.v2.uploader.destroy(existingProfilePicture, { folder: "link-hub" }, function (error, result) {
                if (error) {
                    throw error;
                }
            });
        }
        await prisma.user.update({
            where: { id: getIdToken },
            data: {
                profile_picture: null,
            },
        });
        res.status(202).json({
            message: `Success Delete Picture`,
            data: {
                profile_picture: null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = { getProfile, editProfile, deletePicture };
//# sourceMappingURL=profile.js.map