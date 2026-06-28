import { prisma } from "../../../lib/prisma";

export class ConversationService{
    static async getConversation(chatId:string){
        return prisma.message.findMany({
            where:{chatId},orderBy:{createdAt:"asc",},take:20,
        })
    }
    static formatConversation(message:{role:string;content:string;}[]){
        return message.map((message)=>`${message.role.toUpperCase()}: ${message.content}`).join("\n\n")
    }
}