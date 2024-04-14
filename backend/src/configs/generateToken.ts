import jwt, { JwtPayload } from "jsonwebtoken";


function generateAccessToken(userId: string, role: string): string {
    // Generate access token with 15-minute expiration
    const token = jwt.sign(
        {
            userId: userId,
            role: role
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '15m' }
    );
    return token;
};

function generateRefreshToken(userId: string, role: string): string {
    // Generate refresh token with 1-day expiration
    const refreshToken = jwt.sign(
        {
            userId: userId,
            role: role
        },
        process.env.JWT_REFRESH_KEY as string,
        { expiresIn: "1d" }
    );
    return refreshToken;
};

export { generateAccessToken, generateRefreshToken };