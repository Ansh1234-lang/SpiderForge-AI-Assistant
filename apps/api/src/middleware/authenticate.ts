import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { success } from "zod";


export interface AuthRequest extends Request {
    user?: {
        userId: string,
        role: string,
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            userId: string;
            role: string;
        }
        req.user = decoded;
        next()
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}