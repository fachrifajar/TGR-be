import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const { cloudinary } = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");

const getProfile = async (req: Request, res: Response) => {
  try {
    const getIdToken: string = (req as any).id;

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
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const editProfile = async (req: Request, res: Response) => {
  interface RequestBody {
    username: string;
    profile_picture: Object;
    phone_number: string;
  }
  try {
    const { username, profile_picture, phone_number }: RequestBody = req.body;

    const getIdToken: string = (req as any).id;

    const user = await prisma.user.findUnique({
      where: { id: getIdToken },
      select: {
        username: true,
        profile_picture: true,
        phone_number: true,
      },
    });
    const existingProfilePicture = user?.profile_picture;

    const getProfilePicture = (req as any)?.files?.profile_picture;

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

    if ((req as any).files) {
      // Delete existing picture if exist

      if (existingProfilePicture) {
        await cloudinary.v2.uploader.destroy(
          existingProfilePicture,
          { folder: "TGR" },
          function (error: any, result: any) {
            if (error) {
              throw error;
            }
          }
        );
      }

      // Upload new picture
      if (getProfilePicture) {
        await cloudinary.v2.uploader.upload(
          getProfilePicture.tempFilePath,
          { public_id: uuidv4(), folder: "TGR" },
          async function (error: any, result: any) {
            if (error) {
              throw error;
            }

            profilePictureCloudinary = result?.public_id;
          }
        );
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
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePicture = async (req: Request, res: Response) => {
  interface RequestBody {
    profile_picture: boolean;
  }
  try {
    const { profile_picture }: RequestBody = req.body;
    const getIdToken: string = (req as any).id;

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
      await cloudinary.v2.uploader.destroy(
        existingProfilePicture,
        { folder: "link-hub" },
        function (error: any, result: any) {
          if (error) {
            throw error;
          }
        }
      );
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
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProfile, editProfile, deletePicture };
