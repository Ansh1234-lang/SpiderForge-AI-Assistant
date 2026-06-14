import jwt from "jsonwebtoken";

interface jwtPayLoad{
    userId:string;
    role:string;
}

export function generateAccessToken(payLoad:jwtPayLoad){
    return jwt.sign(
        payLoad,
        process.env.JWT_SECRET!,
        {
            expiresIn:"15m"
        }
    );
}

export function generateFreshToken(payload:jwtPayLoad){
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn:"30d"
        }
    );
}

export function verifyAccessToken(token:string){
    return jwt.verify(
        token,
        process.env.JWT_SECRET!
    );
}

export function verifyrefreshToken(token:string){
    return jwt.verify(
        token,
        process.env.JRT_REFRESH_SECRET!
    );
}