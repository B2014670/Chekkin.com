import express, {Request, Response} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/api/test",async (req:Request, res: Response) => {
    res.json({message: "hello world"});
})


app.listen(9000, () => {
  console.log(`Server is running at http://localhost:9000`);
});