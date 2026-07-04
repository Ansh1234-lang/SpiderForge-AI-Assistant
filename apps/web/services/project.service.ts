import { api } from "@/lib/api";
import { GetProjectResponse } from "@/types/project";

export const ProjectService = {
    async getProjects() {
        const response = await api.get("/projects")
        return response.data;
    },
};
