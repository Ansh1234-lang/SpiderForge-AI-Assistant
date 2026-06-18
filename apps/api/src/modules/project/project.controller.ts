import { Response } from "express";
import { ProjectService } from "./project.service";
import { AuthRequest } from "../../middleware/authenticate";
import { success } from "zod";

export class ProjectController {
    //  create project
    static async createProject(
        req: AuthRequest,
        res: Response,
    ) {
        const project =
            console.log("REQ USER:", req.user);
        console.log("REQ BODY:", req.body)
        await ProjectService.createProject(
            req.user!.userId,
            req.body,
        );

        return res.status(201).json({
            success: true,
            data: project,
        });
    }

    // get project
    static async getProjects(req: AuthRequest, res: Response) {
        const projects = await ProjectService.getProjects(req.user!.userId);
        return res.json({
            success: true,
            count: projects.length,
            data: projects,
        })
    }
}