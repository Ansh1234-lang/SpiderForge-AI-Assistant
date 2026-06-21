import { response, Response } from "express";
import { ProjectService } from "../services/project.service";
import { AuthRequest } from "../../../middleware/authenticate";
import { GithubService } from "../services/github.service";
import { parseGithubUrl } from "../utils/github";
import { RepositoryService } from "../services/repository.service";
import {prisma} from "../../../lib/prisma"


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

    // clone repository controller
    static async cloneRepository(req:AuthRequest,res:Response){
        try{
            const projectId = req.params.projectId as string;
            if (!projectId){
                return res.status(400).json({
                    success:false,
                    message:"Project id is required"
                })
            }
            const project = await prisma.project.findUnique({
                where:{
                    id : projectId,
                },
            });
            const path = await RepositoryService.cloneRepository(
                project!.githubUrl!,
                projectId);
            return res.json({
                success:true,
                message:"repository cloned successfully",
                path,
            })
        }catch(e){
            console.error(e);
            return res.status(500).json({
                success:false,
                message:"failed to clone repository"
            })
        }
    }

}