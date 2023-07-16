"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const { cloudinary } = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");
const addPost = async (req, res) => {
    try {
        const { title, address, provinsi, kota, kecamatan, kelurahan, type, sub_type, description, bedroom_qty, bathroom_qty, carport_qty, story_qty, bathroom_maid_qty, bedroom_maid_qty, total_room, year_of_build, facilities_interior, facilities_exterior, land_area, property_area, is_rent, rent_period, interior, price, available_from, price_per_meter, wattage, sertificate, map_location, picture, } = req.body;
        const getIdToken = req.id;
        const isRentValue = is_rent === "true";
        const facilities_interior_arr = facilities_interior?.split(",");
        const facilities_exterior_arr = facilities_exterior?.split(",");
        const availableFromDate = new Date(available_from);
        const getPicture = req?.files?.picture;
        let profilePictureCloudinary;
        if (getPicture) {
            const uploadedPictureIds = [];
            if (Array.isArray(getPicture)) {
                // Handle multiple pictures
                for (let i = 0; i < getPicture.length; i++) {
                    const picture = getPicture[i];
                    // Upload each picture
                    await cloudinary.v2.uploader.upload(picture.tempFilePath, { public_id: uuidv4(), folder: "TGR" }, (error, result) => {
                        if (error) {
                            throw error;
                        }
                        uploadedPictureIds.push(result?.public_id);
                    });
                }
            }
            else {
                // Handle single picture
                await cloudinary.v2.uploader.upload(getPicture.tempFilePath, { public_id: uuidv4(), folder: "TGR" }, (error, result) => {
                    if (error) {
                        throw error;
                    }
                    uploadedPictureIds.push(result?.public_id);
                });
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
                facilities_interior: facilities_interior_arr,
                facilities_exterior: facilities_exterior_arr,
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const editPost = async (req, res) => {
    try {
        const { id, title, address, provinsi, kota, kecamatan, kelurahan, type, sub_type, description, bedroom_qty, bathroom_qty, carport_qty, story_qty, bathroom_maid_qty, bedroom_maid_qty, total_room, year_of_build, facilities_interior, facilities_exterior, land_area, property_area, is_rent, rent_period, interior, price, available_from, price_per_meter, wattage, sertificate, map_location, picture, picture_remove, } = req.body;
        const user = await prisma.post.findUnique({
            where: { id },
        });
        const isRentValue = is_rent === "true";
        const facilities_interior_arr = facilities_interior?.split(",");
        const facilities_exterior_arr = facilities_exterior?.split(",");
        let availableFromDate;
        if (available_from) {
            availableFromDate = new Date(available_from);
        }
        const existingPicture = user?.picture;
        const getPicture = req?.files?.picture;
        let profilePictureCloudinary;
        let existingValues;
        const pictureRemoveArr = picture_remove?.split(",");
        if (picture_remove?.length) {
            existingValues = existingPicture?.filter((value) => !picture_remove?.includes(value));
        }
        if (pictureRemoveArr?.length) {
            for (const picture of pictureRemoveArr) {
                await cloudinary.v2.uploader.destroy(picture, { folder: "TGR" }, function (error, result) {
                    if (error) {
                        throw error;
                    }
                });
            }
        }
        if (getPicture) {
            const uploadedPictureIds = [];
            if (Array.isArray(getPicture)) {
                // Handle multiple pictures
                for (const picture of getPicture) {
                    // Upload each picture
                    const result = await cloudinary.v2.uploader.upload(picture.tempFilePath, { public_id: uuidv4(), folder: "TGR" });
                    uploadedPictureIds.push(result?.public_id);
                }
            }
            else {
                // Handle single picture
                const result = await cloudinary.v2.uploader.upload(getPicture.tempFilePath, { public_id: uuidv4(), folder: "TGR" });
                uploadedPictureIds.push(result?.public_id);
            }
            // Assign uploaded picture IDs to profilePictureCloudinary
            profilePictureCloudinary = uploadedPictureIds;
        }
        let combinedPicture;
        if (profilePictureCloudinary?.length) {
            combinedPicture = [
                ...(existingValues || existingPicture || []),
                ...profilePictureCloudinary,
            ];
        }
        else {
            combinedPicture = existingValues || existingPicture;
        }
        const editPost = await prisma.post.update({
            where: { id },
            data: {
                title: title || user?.title,
                address: address || user?.address,
                provinsi: provinsi || user?.provinsi,
                kota: kota || user?.kota,
                kecamatan: kecamatan || user?.kecamatan,
                kelurahan: kelurahan || user?.kelurahan,
                type: type || user?.type,
                sub_type: sub_type || user?.sub_type,
                description: description || user?.description,
                bedroom_qty: bedroom_qty || user?.bedroom_qty,
                bathroom_qty: bathroom_qty || user?.bathroom_qty,
                carport_qty: carport_qty || user?.carport_qty,
                story_qty: story_qty || user?.story_qty,
                bathroom_maid_qty: bathroom_maid_qty || user?.bathroom_maid_qty,
                bedroom_maid_qty: bedroom_maid_qty || user?.bedroom_maid_qty,
                total_room: total_room || user?.total_room,
                year_of_build: year_of_build || user?.year_of_build,
                facilities_interior: facilities_interior_arr || user?.facilities_interior,
                facilities_exterior: facilities_exterior_arr || user?.facilities_exterior,
                land_area: land_area || user?.land_area,
                property_area: property_area || user?.property_area,
                is_rent: isRentValue || user?.is_rent,
                rent_period: rent_period || user?.rent_period,
                interior: interior || user?.interior,
                price: price || user?.price,
                available_from: available_from
                    ? availableFromDate
                    : user?.available_from,
                price_per_meter: price_per_meter || user?.price_per_meter,
                wattage: wattage || user?.wattage,
                sertificate: sertificate || user?.sertificate,
                map_location: map_location || user?.map_location,
                picture: combinedPicture?.length || picture_remove
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await prisma.post.update({
            where: { id },
            data: {
                view_count: post.view_count + 1,
            },
        });
        return res.status(200).json({ message: "View count updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const editSave = async (req, res) => {
    try {
        const { post_id } = req.body;
        const getIdToken = req.id;
        const getPrevSave = await prisma.user.findUnique({
            where: { id: getIdToken },
            select: {
                save: true,
            },
        });
        let existingValues;
        if (getPrevSave?.save?.length) {
            existingValues = getPrevSave?.save?.includes(post_id);
        }
        if (!existingValues) {
            await prisma.save.create({
                data: {
                    post_id,
                    user_id: getIdToken,
                },
            });
            let combinedSave = getPrevSave
                ? [...getPrevSave?.save, post_id]
                : [post_id];
            await prisma.user.update({
                where: { id: getIdToken },
                data: { save: combinedSave },
            });
            res.status(201).json({
                message: `Success save`,
            });
        }
        else {
            await prisma.save.deleteMany({
                where: {
                    AND: [{ post_id: post_id }, { user_id: getIdToken }],
                },
            });
            let filteredSave = getPrevSave?.save.filter((value) => value !== post_id);
            await prisma.user.update({
                where: { id: getIdToken },
                data: { save: filteredSave },
            });
            res.status(200).json({
                message: `Success delete save`,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const getData = await prisma.post.findUnique({
            where: {
                id,
            },
            select: {
                picture: true,
            },
        });
        console.log(getData?.picture);
        if (getData?.picture?.length) {
            for (const picture of getData?.picture) {
                await cloudinary.v2.uploader.destroy(picture, { folder: "TGR" }, function (error, result) {
                    if (error) {
                        throw error;
                    }
                });
            }
        }
        await prisma.save.deleteMany({
            where: {
                post_id: id,
            },
        });
        await prisma.post.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            message: `Success delete a post`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getPost = async (req, res) => {
    try {
        const { key } = req.params;
        const { pageSize, pageNumber, sortBy, searchBy, searchFilter, searchById, } = req.query;
        let data;
        let skip;
        if (pageSize || pageNumber)
            skip = (parseInt(pageNumber) - 1) * parseInt(pageSize);
        if (searchById) {
            data = await prisma.post.findUnique({
                where: {
                    is_archived: false,
                    id: searchById,
                },
            });
            res.status(200).json({
                message: "Success get search by ID",
                data,
            });
        }
        else {
            const filterConditions = {
                is_archived: false,
                OR: [
                    { title: { contains: key, mode: "insensitive" } },
                    { address: { contains: key, mode: "insensitive" } },
                    { provinsi: { contains: key, mode: "insensitive" } },
                    { kota: { contains: key, mode: "insensitive" } },
                    { kecamatan: { contains: key, mode: "insensitive" } },
                    { kelurahan: { contains: key, mode: "insensitive" } },
                ],
            };
            if (searchBy || searchFilter) {
                if (searchBy) {
                    filterConditions.type = searchBy;
                }
                if (searchFilter) {
                    filterConditions.is_rent = searchFilter === "dijual" ? false : true;
                }
            }
            let orderBy = {};
            if (sortBy === "popular") {
                orderBy = { view_count: "desc" };
            }
            else if (sortBy === "newest") {
                orderBy = { created_at: "desc" };
            }
            else if (sortBy === "hi-price") {
                orderBy = { price: "desc" };
            }
            else if (sortBy === "lo-price") {
                orderBy = { price: "asc" };
            }
            else if (!sortBy) {
                orderBy = { created_at: "desc" };
            }
            const [totalCount, postData] = await Promise.all([
                prisma.post.count({
                    where: filterConditions,
                }),
                prisma.post.findMany({
                    where: filterConditions,
                    orderBy,
                    skip,
                    take: parseInt(pageSize),
                }),
            ]);
            const totalPages = Math.ceil(totalCount / parseInt(pageSize));
            res.status(200).json({
                message: "Success get Data",
                page: pageNumber,
                dataPerPage: pageSize,
                totalPages,
                totalData: totalCount,
                data: postData,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getMyPost = async (req, res) => {
    try {
        const getIdToken = req.id;
        const data = await prisma.post.findMany({
            where: {
                user_id: getIdToken,
            },
        });
        res.status(200).json({
            message: "Success get my post",
            total: data?.length,
            data,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = {
    addPost,
    editPost,
    editSave,
    deletePost,
    getPost,
    incrementViewCount,
    getMyPost,
};
//# sourceMappingURL=post.js.map