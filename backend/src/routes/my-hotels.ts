import express, { Request, Response } from "express";
import upload from "../middleware/multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();


// api/my-hotels
router.post("/",
    verifyToken,
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage("Price per night is required and must be a number"),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage("Facilities are required"),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => { // & { files: Express.Multer.File[] }
        try {
            const newHotel = req.body as HotelType;

            //cast req.files to an array of Express.Multer.File objects.
            const imageFiles = req.files as Express.Multer.File[];

            //upload images to cloudinary
            const imageUrls = await uploadImages(imageFiles);

            //add URL images to new hotel
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            //save new hotel to database
            const hotel = new Hotel(newHotel);
            await hotel.save();

            return res.status(200).send(hotel);
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Something went wrong" })
        }
    }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels)
    } catch (error) {
        return res.status(500).json({ message: "Error went find your hotels!" });
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotels = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });
        res.json(hotels)
    } catch (error) {
        return res.status(500).json({ message: "Error went find this hotel!" });
    }
});

router.patch(
    "/:hotelId",
    verifyToken,
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const updatedHotel = req.body as HotelType;
            updatedHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate(
                {
                    _id: req.params.hotelId,
                    userId: req.userId,
                },
                updatedHotel,
                { new: true }
            );


            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            //update image
            const imageFiles = req.files as Express.Multer.File[];
            const updatedImageUrls = await uploadImages(imageFiles);

            //delete image
            if (updatedHotel.imageUrlsDelete) {
                await deleteImages(updatedHotel.imageUrlsDelete);
            }

            hotel.imageUrls = [
                ...updatedImageUrls,//update new file image
                ...(updatedHotel.imageUrls || []),//up date old url image when delete 
            ];

            await hotel.save();
            res.status(201).json(hotel);
        } catch (error) {
            res.status(500).json({ message: "Something went throw" });
        }
    }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const options = {
        folder: process.env.CLOUDINARY_CLOUD_FOLDER, // Specify the folder in which the file should be stored
    };
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI, options);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

async function deleteImages(imageUrlsDelete: string[]) {
    imageUrlsDelete.map(async (url) => {
        const regex = /\/v\d+\/(.*?)\./;
        const result = url.match(regex);
        if (result && result.length > 1) {
            const public_id = result[1];
            await cloudinary.v2.uploader.destroy(public_id);
        }
    });
}
export default router;