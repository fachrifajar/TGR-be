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

    const isRentValue: boolean = is_rent === "true";

    const availableFromDate: Date = new Date(available_from);

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

const editPost = async (req: Request, res: Response) => {
  type RequestBody = {
    title?: string;
    address?: string;
    provinsi?: string;
    kota?: string;
    kecamatan?: string;
    kelurahan?: string;
    type?: string;
    sub_type?: string;
    description?: string;
    bedroom_qty?: string;
    bathroom_qty?: string;
    carport_qty?: string;
    story_qty?: string;
    bathroom_maid_qty?: string;
    bedroom_maid_qty?: string;
    total_room?: string;
    year_of_build?: string;
    facilities_interior?: string[];
    facilities_exterior?: string[];
    land_area?: string;
    property_area?: string;
    is_rent?: string;
    rent_period?: string;
    interior?: string;
    price?: string;
    available_from?: string;
    price_per_meter?: string;
    wattage?: string;
    sertificate?: string;
    map_location?: string;
    picture?: string[];
    id: string;
    picture_remove?: string;
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
      id,
      picture_remove,
    }: RequestBody = req.body;

    const user = await prisma.post.findUnique({
      where: { id },
    });

    const isRentValue: boolean = is_rent === "true";

    let availableFromDate: Date | undefined;
    if (available_from) {
      availableFromDate = new Date(available_from);
    }

    const existingPicture = user?.picture;
    const getPicture = (req as any)?.files?.picture;

    let profilePictureCloudinary: Array<string> | undefined;
    let existingValues: Array<string> | undefined;

    const pictureRemoveArr = picture_remove?.split(",");
    if (picture_remove?.length) {
      existingValues = existingPicture?.filter(
        (value) => !picture_remove?.includes(value)
      );
    }

    if (pictureRemoveArr?.length) {
      for (let i = 0; i < pictureRemoveArr?.length; i++) {
        const picture = pictureRemoveArr[i];

        await cloudinary.v2.uploader.destroy(
          picture,
          { folder: "TGR" },
          function (error: any, result: any) {
            if (error) {
              throw error;
            }
          }
        );
      }
    }

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

    let combinedPicture: Array<string> | undefined;

    if (profilePictureCloudinary?.length) {
      if (existingPicture) {
        if (existingValues) {
          combinedPicture = [...profilePictureCloudinary, ...existingValues];
        } else {
          combinedPicture = [...profilePictureCloudinary, ...existingPicture];
        }
      }
    } else {
      if (existingPicture) {
        if (existingValues) {
          combinedPicture = existingValues;
        } else {
          combinedPicture = existingPicture;
        }
      }
    }

    const editPost = await prisma.post.update({
      where: { id },
      data: {
        title: title ? title : user?.title,
        address: address ? address : user?.address,
        provinsi: provinsi ? provinsi : user?.provinsi,
        kota: kota ? kota : user?.kota,
        kecamatan: kecamatan ? kecamatan : user?.kecamatan,
        kelurahan: kelurahan ? kelurahan : user?.kelurahan,
        type: type ? type : user?.type,
        sub_type: sub_type ? sub_type : user?.sub_type,
        description: description ? description : user?.description,
        bedroom_qty: bedroom_qty ? bedroom_qty : user?.bedroom_qty,
        bathroom_qty: bathroom_qty ? bathroom_qty : user?.bathroom_qty,
        carport_qty: carport_qty ? carport_qty : user?.carport_qty,
        story_qty: story_qty ? story_qty : user?.story_qty,
        bathroom_maid_qty: bathroom_maid_qty
          ? bathroom_maid_qty
          : user?.bathroom_maid_qty,
        bedroom_maid_qty: bedroom_maid_qty
          ? bedroom_maid_qty
          : user?.bedroom_maid_qty,
        total_room: total_room ? total_room : user?.total_room,
        year_of_build: year_of_build ? year_of_build : user?.year_of_build,
        facilities_interior: facilities_interior
          ? facilities_interior
          : user?.facilities_interior,
        facilities_exterior: facilities_exterior
          ? facilities_exterior
          : user?.facilities_exterior,
        land_area: land_area ? land_area : user?.land_area,
        property_area: property_area ? property_area : user?.property_area,
        is_rent: isRentValue ? isRentValue : user?.is_rent,
        rent_period: rent_period ? rent_period : user?.rent_period,
        interior: interior ? interior : user?.interior,
        price: price ? price : user?.price,
        available_from: available_from
          ? availableFromDate
          : user?.available_from,
        price_per_meter: price_per_meter
          ? price_per_meter
          : user?.price_per_meter,
        wattage: wattage ? wattage : user?.wattage,
        sertificate: sertificate ? sertificate : user?.sertificate,
        map_location: map_location ? map_location : user?.map_location,
        picture:
          combinedPicture?.length || picture_remove
            ? combinedPicture
            : user?.picture,
      },
      select: {
        id: true,
      },
    });

    res.status(201).json({
      message: `Success Edit post: ${editPost?.id}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { addPost, editPost };
