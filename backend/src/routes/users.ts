import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { generateAccessToken } from "../configs/generateToken";
const router = express.Router();

// api/users 
router.post("/register",
    [
        check("firstName", "First Name is required").isString(),
        check("lastName", "Last Name is required").isString(),
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
        try {
            let user = await User.findOne({
                email: req.body.email.toLowerCase(),
            });
            if (user) {
                return res.status(401).json({ message: "User already exists!" });
            }

            user = new User(req.body);
            await user.save();

            const token = generateAccessToken({ userId: user.id });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24*60*60*1000,
            });

            return res.status(200).send({ message: "User registered OK" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Wrong Register" })
        }

    });

export default router;