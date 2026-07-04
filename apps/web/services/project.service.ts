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
    }
};
