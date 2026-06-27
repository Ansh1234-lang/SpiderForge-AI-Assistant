import { prisma } from "../../../lib/prisma";

export class ChatHistoryService {
    static async createChat(projectId: string, userId: string,) {
        return prisma.chat.create({ data: { projectId, userId, title: "New Chat" } })
    }
    static async getProjectChats(projectId: string) {
        return prisma.chat.findMany({ where: { projectId }, orderBy: { updatedAt: "desc" }, })
    }
    static async getMessages(chatId: string) {
        return prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: "asc" } })
    }
}