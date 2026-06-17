import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { success, ZodError } from "zod";

export const errorHandler = (
    error:any,
    _req: Request,
    res:Response,
    _next:NextFunction
)=>{
    console.error(error);
    if(error instanceof ZodError){
        return res.status(400).json({
            success:false,
            message:"validation failed",
            errors: error.issues,
        });
    }

    return res.status(500).json({
        success:false,
        message:
        error.message || "Internal Server Error"
    })
}