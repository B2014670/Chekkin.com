import jwt, { JwtPayload } from "jsonwebtoken";

interface User {
    userId: string; // Assuming user ID is a string
};

function generateAccessToken (userId: User): string {
    // Generate access token with 15-minute expiration
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "15m" }
    );
    return token;
};

function generateRefreshToken (userId: User): string {
    // Generate refresh token with 1-day expiration
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_KEY as string,
        { expiresIn: "1d" }
    );
    return refreshToken;
};

export { generateAccessToken, generateRefreshToken };