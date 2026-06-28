import { GoogleGenAI } from "@google/genai";
import { SearchService } from "./search.service";
import { prisma } from "../../../lib/prisma";
import { ConversationService } from "./conversation.service";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!, })

export class ChatService {
    static async generateResponse(prompt: string): Promise<string> {
        for (let i = 0; i < 3; i++) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-lite",
                    contents: prompt,
                });

                return response.text ?? "";
            } catch (error: any) {
                if (error.status === 503 && i < 2) {
                    console.log(`Retry ${i + 1}...`);
                    await new Promise((r) => setTimeout(r, 3000));
                    continue;
                }
                throw error;
            }
        }
        throw new Error("failed to generate response after reties")
    }
    static async chat(projectId: string, chatId: string, question: string) {
        const history = await ConversationService.getConversation(chatId);
        console.log(history)
        const conversation = ConversationService.formatConversation(history);
        console.log(conversation)
        const results = (await SearchService.search(projectId, question)).slice(0, 5);
        const context = results.map((chunk) => `FILE:${chunk.filePath}\n${chunk.content}`).join("\n\n--------------\n\n");
        const prompt = `
        You are an expert software engineer.

        Answer ONLY using the repository context below.

        If the answer is not present in the context, say :

        "I could not find that information in the repository"

        ========================
        Previous Conversation
        ========================

        ${conversation}

        ========================
        Repository Context
        ========================

        ${context}

        ========================
        Current Question
        ========================

        ${question}
        `;

        const chat = await prisma.chat.findUnique({ where: { id: chatId } })
        console.log(chat?.title)
        let chatTitle = chat?.title ?? "New Chat;"
        if (chatTitle === "New Chat") {
            console.log("generating title........")
            chatTitle = await this.generateTitle(question)
        }
        try {
            await prisma.message.create({ data: { chatId, role: "user", content: question, } })
            const answer = await this.generateResponse(prompt);
            await prisma.message.create({ data: { chatId, role: "assistant", content: answer } })
            if (chatTitle !== chat?.title) {
                await prisma.chat.update({ where: { id: chatId }, data: { title: chatTitle } })
            }

            return answer
        }
        catch (e: any) {
            console.error("CATCHED ERROR", e);
            if (e.status === 429) {
                throw new Error("Gemini quota exceeded . please try again later")
            }
            throw e
        }
    };

    static async generateTitle(question: string): Promise<string> {
        const prompt = `
        Generate a short chat Title.

        rules:
            - Maximum 5 words.
            - No quotes.
            - No punctuation.
            - Return only the title.

            Question:
            ${question}
        `
        const title = await this.generateResponse(prompt);
        console.log("generated title : ", title);
        return title?.trim() ?? "New Chat";
    }

}