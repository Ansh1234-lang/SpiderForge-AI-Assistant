import { Response } from "express";
import path from "path";
import { ProjectService } from "../services/project.service";
import { AuthRequest } from "../../../middleware/authenticate";
import { GithubService } from "../services/github.service";
import { parseGithubUrl } from "../utils/github";
import { RepositoryService } from "../services/repository.service";
import { prisma } from "../../../lib/prisma"
import { ScannerService } from "../services/scanner.service";
import { chunkService } from "../services/chunk.service";
import { IndexingService } from "../services/indexing.service"; import { string, success } from "zod";
import { EmbeddingService } from "../services/embedding.service";
import { SearchService } from "../services/search.service";
import { ChatService } from "../services/chat.service";
import { ChatHistoryService } from "../services/chat-history.service";



export class ProjectController {
    //  create project
    static async createProject(
        req: AuthRequest,
        res: Response,
    ) {
        const project =
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
    static async cloneRepository(req: AuthRequest, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            if (!projectId) {
                return res.status(400).json({
                    success: false,
                    message: "Project id is required"
                })
            }
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                },
            });
            const path = await RepositoryService.cloneRepository(
                project!.githubUrl!,
                projectId);
            return res.json({
                success: true,
                message: "repository cloned successfully",
                path,
            })
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                success: false,
                message: "failed to clone repository"
            })
        }
    }

    // scanner Controller
    static async scanRepository(
        req: AuthRequest,
        res: Response
    ) {
        try {
            const projectId = req.params.projectId as string;
            const repoPath = path.join(
                process.cwd(),
                "..",
                "..",
                "storage",
                "repositories",
                projectId
            );
            const files = await ScannerService.scanRepository(repoPath);

            return res.json({
                success: true,
                count: files.length,
                data: files,
            })
        } catch (e: any) {
            console.error("SCAN ERROR", e);
            return res.status(500).json({
                success: false,
                message: "failed tp scan repository"
            })
        }
    }

    // chunk controller
    static async chunkRepository(
        req: AuthRequest, res: Response
    ) {
        try {
            const projectId = req.params.projectId as string
            const repoPath = path.join(
                process.cwd(),
                "..",
                "..",
                "storage",
                "repositories",
                projectId
            )
            const files = await ScannerService.scanRepository(
                repoPath
            );
            const chunks = chunkService.chunkFiles(files);
            return res.json({
                success: true,
                files: files.length,
                chunks: chunks.length,
                data: chunks.slice(0, 10),
            })
        } catch (e) {
            console.error("CHUNK ERROR", e)
            return res.status(500).json({
                success: true,
                message: "failed to chunk repository"
            })
        }
    }

    // index controller
    static async indexRepository(
        req: AuthRequest, res: Response
    ) {
        try {
            const projectId = req.params.projectId as string;
            const result = await IndexingService.indexRepository(projectId);
            return res.json({
                success: true,
                files: result.files,
                chunks: result.chunks,
            })
        } catch (e) {
            console.error(e)
            return res.status(500).json({
                success: false,
                message: "failed to index repository"
            })
        }
    }

    // embed controller
    static async embedRepository(req: AuthRequest, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            await EmbeddingService.embedProject(projectId)
            return res.json({
                success: true,
                message: "embedding generated"
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                success: false,
                message: "failed to generate embeddings"
            })
        }
    }

    // search controller
    static async searchRepository(req: AuthRequest, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const { query } = req.body;

            const result = await SearchService.search(projectId, query);
            return res.json({
                success: true,
                result
            })
        } catch (e: any) {
            console.error("SEARCH ERROR", e);
            res.status(500).json({
                success: false,
                message: e.message,
            })
        }
    }

    // chat controller
    static async chatRepository(req: AuthRequest, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const {chatId, question } = req.body;
            const answer = await ChatService.chat(projectId,chatId, question);
            return res.json({
                success: true,
                answer
            })
        }
        catch (e: any) {
            console.error("ERROR CATCHED", e)
            return res.status(500).json({ success: false, message: e.message })
        }
    }

    // create chat controller
    static async createChat(req: AuthRequest, res: Response) {
        const projectId = req.params.projectId as string
        const chat = await ChatHistoryService.createChat(projectId, req.user!.userId);
        return res.status(201).json({
            success: true,
            chat
        })
    }

    // get chat controller
    static async getChats(req: AuthRequest, res: Response) {
        const projectId = req.params.projectId as string;
        const chats = await ChatHistoryService.getProjectChats(projectId,);
        return res.json({
            success: true,
            chats,
        })
    }
    // get messages controller
    static async getMessages(req: AuthRequest, res: Response) {
        const {chatId} = req.params;
        const messages = await ChatHistoryService.getMessages(chatId);
        return res.json({
            success: true,
            messages
        })
    }

}