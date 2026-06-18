import express from "express";
import cors from "cors";
import helmet from "helmet"
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes"
import { errorHandler } from "./middleware/error-handler";

const app = express();


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

app.get("/health",(_,res)=>{
    res.json({
        status:"ok"
    });
});

app.use("/api/auth",authRoutes);
app.use(errorHandler);
app._router?.stack?.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
app.get("/api/auth/register",(_,res)=>{
    res.json({
        route:"register route exist , but use post"
    })
})
app.listen(5000,()=>{
    console.log("api running on port 5000");
})