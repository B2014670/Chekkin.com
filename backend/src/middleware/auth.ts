import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            // Add other properties Request type
        }
    }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        // Attach the decoded user information to the request object
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
}

export default verifyToken;