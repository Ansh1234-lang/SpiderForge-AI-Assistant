import { Request,Response } from "express";
import { AdminService } from "./admin.service";

export class AdminController{
    static async getUsers(
        _req:Request,
        res:Response,
    ){
        const users= await AdminService.getAllUsers();
        return res.json({
            success:true,
            count: users.length,
            data:users,
        });
    }
}