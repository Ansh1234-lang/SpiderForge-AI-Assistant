import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { ProjectController } from "../controllers/project.controller";



const router = Router();

router.post("/",authenticate,ProjectController.createProject)

router.get("/",authenticate,ProjectController.getProjects);

router.post("/validate",authenticate,ProjectController.validateRepo);

router.post("/:projectId/clone",authenticate,ProjectController.cloneRepository)

router.get("/:projectId/scan",authenticate,ProjectController.scanRepository)

router.get("/:projectId/chunks",authenticate,ProjectController.chunkRepository)

router.post("/:projectId/index",authenticate,ProjectController.indexRepository)

router.post("/:projectId/embed",authenticate,ProjectController.embedRepository)

router.post("/:projectId/search",authenticate,ProjectController.searchRepository)

router.post("/:projectId/chat",authenticate,ProjectController.chatRepository)

export default router;