import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const { cloudinary } = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");

const addPost = async (req: Request, res: Response) => {
  type RequestBody = {
    title: string;
    address: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    type: string;
    sub_type: string;
    description: string;
    bedroom_qty: string;
    bathroom_qty: string;
    carport_qty?: string;
    story_qty?: string;
    bathroom_maid_qty?: string;
    bedroom_maid_qty?: string;
    total_room?: string;
    year_of_build?: string;
    facilities_interior?: string[];
    facilities_exterior?: string[];
    land_area?: string;
    property_area: string;
    is_rent: string;
    rent_period?: string;
    interior: string;
    price: string;
    available_from: string;
    price_per_meter?: string;
    wattage?: string;
    sertificate: string;
    map_location: string;
    picture?: string[];
  };
  try {
    const {
      title,
      address,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      type,
      sub_type,
      description,
      bedroom_qty,
      bathroom_qty,
      carport_qty,
      story_qty,
      bathroom_maid_qty,
      bedroom_maid_qty,
      total_room,
      year_of_build,
      facilities_interior,
      facilities_exterior,
      land_area,
      property_area,
      is_rent,
      rent_period,
      interior,
      price,
      available_from,
      price_per_meter,
      wattage,
      sertificate,
      map_location,
      picture,
    }: RequestBody = req.body;

    const getIdToken: string = (req as any).id;

    const user = await prisma.post.findUnique({
      where: { id: getIdToken },
      select: {
        picture: true,
      },
    });

    const isRentValue: boolean = is_rent === "true";

    const availableFromDate: Date = new Date(available_from);

    const existingPicture = user?.picture;
    const getPicture = (req as any)?.files?.picture;
    let profilePictureCloudinary;

    if (getPicture) {
      const uploadedPictureIds: string[] = [];

      if (Array.isArray(getPicture)) {
        // Handle multiple pictures
        for (let i = 0; i < getPicture.length; i++) {
          const picture = getPicture[i];

          // Upload each picture
          await cloudinary.v2.uploader.upload(
            picture.tempFilePath,
            { public_id: uuidv4(), folder: "TGR" },
            (error: any, result: any) => {
              if (error) {
                throw error;
              }

              uploadedPictureIds.push(result?.public_id);
            }
          );
        }
      } else {
        // Handle single picture
        await cloudinary.v2.uploader.upload(
          getPicture.tempFilePath,
          { public_id: uuidv4(), folder: "TGR" },
          (error: any, result: any) => {
            if (error) {
              throw error;
            }

            uploadedPictureIds.push(result?.public_id);
          }
        );
      }

      // Assign uploaded picture IDs to profilePictureCloudinary
      profilePictureCloudinary = uploadedPictureIds;
    }
    console.log(profilePictureCloudinary);
    const addPost = await prisma.post.create({
      data: {
        user_id: getIdToken,
        title,
        address,
        provinsi,
        kota,
        kecamatan,
        kelurahan,
        type,
        sub_type,
        description,
        bedroom_qty,
        bathroom_qty,
        carport_qty,
        story_qty,
        bathroom_maid_qty,
        bedroom_maid_qty,
        total_room,
        year_of_build,
        facilities_interior,
        facilities_exterior,
        land_area,
        property_area,
        is_rent: isRentValue,
        rent_period,
        interior,
        price,
        available_from: availableFromDate,
        price_per_meter,
        wattage,
        sertificate,
        map_location,
        picture: profilePictureCloudinary,
      },
      select: {
        id: true,
      },
    });

    res.status(201).json({
      message: `Success add new Post: ${addPost?.id}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editPost = async (req: Request, res: Response) => {};

module.exports = { addPost, editPost };
