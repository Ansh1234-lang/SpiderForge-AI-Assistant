import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { ProjectController } from "../controllers/project.controller";

const router = Router();

router.post("/",authenticate,ProjectController.createProject)

router.get("/",authenticate,ProjectController.getProjects);

router.post("/validate",authenticate,ProjectController.validateRepo);

export default router;