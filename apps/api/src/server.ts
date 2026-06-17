import express from "express";
import cors from "cors";
import helmet from "helmet"
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes"

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

app.use("/api.auth",authRoutes);

app.listen(5000,()=>{
    console.log("api running on port 5000");
})