import express, {Request, Response} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouters from './routes/auth';
import userRouters from './routes/users';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string) //cloud
// mongoose.connect("mongodb://127.0.0.1:27017/hotel" as string) 


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api/auth", authRouters);
app.use("/api/users", userRouters);


app.listen(9000, () => {
  console.log(`Server is running at http://localhost:9000`);
});