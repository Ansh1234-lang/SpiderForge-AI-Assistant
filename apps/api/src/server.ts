import expres from "express";
import cors from "cors";
import helmet from "helmet"


const app = expres();


app.use(cors());
app.use(helmet());
app.use(expres.json());

app.get("/health",(_,res)=>{
    res.json({
        status:"ok"
    });
});

app.listen(5000,()=>{
    console.log("api running on port 5000");
})