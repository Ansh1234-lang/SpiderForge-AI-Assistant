import axios from "axios"
import { auth } from "./auth"


export const api = axios.create({baseURL:process.env.NEXT_PUBLIC_API_URL,
    headers:{"Content-Type":"application/jsoon"}
})

api.interceptors.request.use(
    (config)=>{
        const token = auth.getToken();
        if (token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (e)=>Promise.reject(e)
)