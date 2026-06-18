import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";


const router = Router()

router.get("/dashboard",authenticate,authorize("ADMIN"),(_req,res)=>{
    res.json({
        success:true,
        message:"Welcome Admin Dashboard"
    })
})

export default router;