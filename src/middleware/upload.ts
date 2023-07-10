require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const MB = 2;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;
import { Request, Response, NextFunction } from "express";

const filesPayLoadExist = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req as any).files) {
      throw { code: 400, message: "Missing files" };
    }
    next();
  } catch (error: any) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const fileSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!(req as any).files) {
      next();
    } else {
      const files = (req as any).files;

      const filesOverLimit: string[] = [];

      Object.keys(files).forEach((key) => {
        if (files[key].size > FILE_SIZE_LIMIT) {
          filesOverLimit.push(files[key].name);
        }
      });

      if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? "are" : "is";

        const sentence =
          `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
            ",",
            ", "
          );

        const message =
          filesOverLimit.length < 3
            ? sentence.replace(",", " and")
            : sentence.replace(/,(?=[^,]*$)/, " and");

        throw { code: 413, message };
      }

      next();
    }
  } catch (error: any) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const fileExtLimiter = (allowedExtArray: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!(req as any).files) {
      next();
    } else {
      const files: any = (req as any).files;

      const fileExtensions: string[] = [];
      Object.keys(files).forEach((key) => {
        fileExtensions.push(path.extname(files[key].name));
      });

      // Are the file extensions allowed?
      const allowed: boolean = fileExtensions.every((ext) =>
        allowedExtArray.includes(ext)
      );

      if (!allowed) {
        const message =
          `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
            ",",
            ", "
          );

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
