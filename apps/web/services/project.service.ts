import { api } from "@/lib/api";
import { GetProjectResponse } from "@/types/project";


export interface CreateProjectDto{
    name:string;
    githubUrl:string;
}
export const ProjectService = {
    async getProjects() :Promise<GetProjectResponse>{
        const response = await api.get<GetProjectResponse>("/projects")
        return response.data;
    },
    async createProject(data:CreateProjectDto){
        const response = await api.post("/projects",data)
        return response.data
    },
    async cloneProject(projectId:string){
        const response= await api.post(
            `/projects/${projectId}/clone`
        )
        return response.data;
    },
    async scanProject(projectId:string){
        console.log("Calling scan api",projectId)
        const response = await api.get(
            `/projects/${projectId}/scan`
        )
        console.log("Scan repo",response)
        return response.data;
    },
    async chunkProject(projectId:string){
        const response = await api.get(
            `/projects/${projectId}/chunks`
        )
        return response.data
    }
    
};
