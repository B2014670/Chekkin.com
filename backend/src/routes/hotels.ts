import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { ParsedQs } from "qs";
import { param, validationResult } from "express-validator";


const router = express.Router();
// api/hotels
router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };//Desc
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
            default:
                sortOptions = {};
                break;
        }

        const pageSize = 3;
        const currentPage = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (currentPage - 1) * pageSize;
        // fetch "pageSize" documents after the first "skip" document
        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: currentPage,
                //total is not evenly divisible by the page size
                pages: Math.ceil(total / pageSize)
            }
        }
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error searching!" });
    }
})

// api/hotels/:id
router.get(
    "/:id",
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const id = req.params.id.toString();
  
      try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching hotel" });
      }
    }
  );

export default router;

function constructSearchQuery(queryParams: any) {
    let constructQuery: any = {};

    if (queryParams.destination) {
        //destination macth city or country     
        constructQuery.$or = [
            { city: new RegExp(queryParams.destination, 'i') }, //case-insensitive RegExp
            { country: new RegExp(queryParams.destination, 'i') },
        ];
    };

    if (queryParams.adultCount) {
        //adultCount > queryParams.adultCount
        constructQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        //macth all
        constructQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        //matches any value in array
        constructQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        //price < maxPrice
        constructQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructQuery;
}
