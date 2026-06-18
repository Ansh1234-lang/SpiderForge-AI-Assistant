import { prisma } from "../../lib/prisma"

export class AdminService {
    static async getAllUsers() {
        return prisma.user.findMany({
            orderBy: {
                createdAt: "desc",

            },
            select: {
                id: true,
                email: true,
                role: true,
                isPremium: true,
                isActive: true,
                createdAt: true,
            }
        })
    }
}