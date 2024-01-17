import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouters from './routes/auth';
import userRouters from './routes/users';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import { error } from 'console';
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/hotel" as string ) //cloud
  .then(() => {
    console.log("Connected to database: ",
      process.env.MONGODB_CONNECTION_STRING)
  })
  .catch(error)
// mongoose.connect("mongodb://127.0.0.1:27017/hotel" as string) 

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


app.listen(9000, () => {
  console.log(`Server is running at http://localhost:9000`);
});