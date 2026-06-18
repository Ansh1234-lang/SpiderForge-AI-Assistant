import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/",authenticate,ProjectController.createProject)
router.get("/",authenticate,ProjectController.getProjects);
export default router;