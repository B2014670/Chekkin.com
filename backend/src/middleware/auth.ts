import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken } from "../configs/generateToken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            role: string;
        }
    }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["auth_token"] || req.body.token || req.query.token || req.headers['x_authorization'];
        if (!token) {
            const refresh_token = req.cookies["auth_refresh_token"];
            // if refresh token exists
            if (!refresh_token) return res.status(401).send('No token provided');

            try {

                const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY as string);
                const userId = (decoded as JwtPayload).userId;
                const role = (decoded as JwtPayload).role;

                const token = generateAccessToken(userId, role);

                res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000,
                });

            } catch (error) {
                return res.status(401).json({ message: "Unauthorized access" });
            }
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const { userId, role } = decoded as JwtPayload;
        // Attach the decoded user information to the request object
        req.userId = userId;
        req.role = role;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        const userId = req.userId;
        const role = req.role;
        if (userId === req.params.id || role === 'user') {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized user access" });
        }
    });
};

export const verifyBusiness = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        const userId = req.userId;
        const role = req.role;
        if (userId === req.params.id || role === 'business') {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized business access" });
        }
    });
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        const role = req.role;
        if (role === 'admin') {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized admin access" });
        }
    });
};


export default verifyToken;