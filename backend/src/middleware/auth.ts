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
    const token = req.cookies["auth_token"] || req.body.token || req.query.token || req.headers['x_authorization'];
    //req.body.token || req.query.token || req.headers['x-access-token']
    if (!token) {
        const refresh_token = req.cookies["auth_refresh_token"];

        // if refresh token exists
        if (!refresh_token) return res.status(401).send('No token provided');

        try {
            const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY as string);
            const userId = (decoded as JwtPayload).userId;

            const token = jwt.sign(
                { userId: userId },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1h", }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            });

            const response = {
                "token": token,
                message: "access token reset" 
            }
            res.status(200).json(response);

        } catch (error) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        // Attach the decoded user information to the request object
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

export default verifyToken;