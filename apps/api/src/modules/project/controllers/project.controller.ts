import { response, Response } from "express";
import { ProjectService } from "../services/project.service";
import { AuthRequest } from "../../../middleware/authenticate";
import { GithubService } from "../services/github.service";
import { parseGithubUrl } from "../utils/github";


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

    // validate repo
    static async validateRepo(
        req: AuthRequest, res: Response
    ) {
        try {
            const { githubUrl } = req.body;

            const { owner, repo } = parseGithubUrl(githubUrl);

            const repository = await GithubService.validateRepo(owner, repo)

            return res.json({
                success: true,
                repository: {
                    name: repository.name,
                    owner: repository.owner,
                    stars: repository.stragazers_count,
                    description: repository.description,
                }
            })
        } catch (e) {
            console.error(e)
            return res.status(400).json({
                success: false,
                message: "Invalid Repository"
            })
        }
    }


}