import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

/* /api/users/login */
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

        const { email, password } = req.body;

        try {
            let user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({ message: "Email or password incorrect!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ message: "Email or password incorrect!" });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d", }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24*60*60*1000,
            });

            res.status(200).json({userId: user.id})
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Wrong Login" })
        }

    });

export default router;