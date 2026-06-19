import { prisma } from "../../../lib/prisma"


export class ProjectService {
    // create Project
    static async createProject(
        userId: string,
        data: {
            name: string,
            githubUrl?: string,
        }
    ) {
        // console.log("USER:", req.user);
        // console.log("BODY:", req.body);
        return prisma.project.create({
            data: {
                userId,
                name: data.name,
                githubUrl: data.githubUrl,
                type:"GITHUB",
            }
        });
    }

    // get Project
    static async getProjects(userId:string){
        return prisma.project.findMany({
            where:{
                userId,
            },
            orderBy:{
                createdAt:"desc",
            },
        })
    }
}