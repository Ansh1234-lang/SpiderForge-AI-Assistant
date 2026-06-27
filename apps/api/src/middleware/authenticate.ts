// import { error } from "console";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest <P = any>
  extends Request<P> {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("PATH:" , req.path);
        console.log("AUTH:",req.headers.authorization)
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
    } catch(err) {
        console.log("AUTH ERROR:",err);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}