import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import verifyToken from "../middleware/auth";
import { generateAccessToken, generateRefreshToken } from "../configs/generateToken";
const router = express.Router();

// api/auth
router.post("/login",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({
            min: 6,
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        req.body.email = req.body.email.toLowerCase();
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });             
            
            if (!user) {
                return res.status(400).json({ message: "Email or password incorrect!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email or password incorrect!" });
            }             
            
            const token = generateAccessToken(user.id, user.role );
            const refreshToken = generateRefreshToken(user.id, user.role);

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie("auth_refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ userId: user._id })
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Wrong Login" })
        }

    }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId, role: req.role });
});

router.post('/token', (req: Request, res: Response) => {
    // refresh the access token
    const refresh_token = req.cookies["auth_refresh_token"];

    // if refresh token exists
    if (!refresh_token) return res.status(404).send('refresh_token null');

    try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_KEY as string);
        const userId = (decoded as JwtPayload).userId;
        const role = (decoded as JwtPayload).role;

        const token = generateAccessToken( userId , role);

        const response = {
            "token": token,
        }
        res.status(200).json(response);

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    } 
})




router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.cookie("auth_refresh_token", "", {
        expires: new Date(0),
    });
    res.status(200).send();
})

export default router;