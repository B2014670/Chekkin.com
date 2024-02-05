import multer from "multer";

const storage = multer.memoryStorage(); //.diskStorage() other setting
// Multer middleware to upload file
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
export default upload;