const mongoose = require("mongoose");

const connectDB =async (): Promise<void>=> {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/hotel" as string) //cloud

    console.log("Connected to database: ", process.env.MONGODB_CONNECTION_STRING)
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

export default connectDB;