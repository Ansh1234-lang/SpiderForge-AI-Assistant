import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { AdminController } from "./admin.controller";

const router = Router()

router.get("/dashboard",authenticate,authorize("ADMIN"),(_req,res)=>{
    res.json({
        success:true,
        message:"Welcome Admin Dashboard"
    })
})
router.get("/users",authenticate,authorize("ADMIN"),AdminController.getUsers);

export default router;