import { api } from "@/lib/api";


export interface LoginData{
    email:string;
    password:string;
}

export interface LoginResponse{
    success:boolean;
    accessToken:string;
    user:{
        id:string;
        email:string;
        role:string;
    }
}

export interface RegisterData {
    name:string;
    email:string;
    password:string;
}

export const AuthService = {
    async login(data:LoginData):Promise<LoginResponse>{
        const response = await api.post<LoginResponse>("/auth/login",data)
        return response.data
    },
    async register(data:RegisterData){
        const response = await api.post("/auth/register",data)
        return response.data
    },
    async me(){
        const response = await api.get("/auth/me")
        return response.data
    }
}