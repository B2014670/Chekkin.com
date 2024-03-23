import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async (): Promise<void> => {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        console.log("Connected to cloudinary:", process.env.CLOUDINARY_CLOUD_NAME)
    } catch (error) {
        console.error("Error connecting to Cloudinary:", error);
        process.exit(1); 
    }
};

export default connectCloudinary;