import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouters from './routes/auth';
import userRouters from './routes/users';
import myHotelRouters from './routes/my-hotels';
import hotelRouters from './routes/hotels';
import cookieParser from "cookie-parser";
import { error } from 'console';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import connectDB from './configs/db';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", authRouters);
app.use("/api/users", userRouters);
app.use("/api/my-hotels", myHotelRouters);
app.use("/api/hotels", hotelRouters);

//serve a static HTML file for all routes that don't match other routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(9000, () => {
  console.log(`Server is running at http://localhost:9000`);
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
});