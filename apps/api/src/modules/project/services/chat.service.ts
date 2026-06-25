import { GoogleGenAI } from "@google/genai";
import { SearchService } from "./search.service";
import { error } from "console";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!, })

export class ChatService {
    static async generateResponse(prompt: string) {
        for (let i = 0; i < 3; i++) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-lite",
                    contents: prompt,
                });

                return response.text;
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
    static async chat(projectId: string, question: string) {
        const results = (await SearchService.search(projectId, question)).slice(0,5);
        const context = results.map((chunk) => `FILE:${chunk.filePath}\n${chunk.content}`).join("\n\n--------------\n\n");
        const prompt = `
        You are an expert software engineer.
        Answer ONLY using the repository context below.
        If the answer is not present in the context, say :
        "I could not find that information in the repository"

        Repository Context :${context}

        Question:${question}
        `;

        // const response = await ai.models.generateContent({ model: "gemini-2.5-flash-lite", contents: prompt });

        try{
            return await this.generateResponse(prompt);
        }
        catch(e:any){
            console.error("CATCHED ERROR",e);
            if (e.status === 429){
                throw new Error("Gemini quota exceeded . please try again later")
            }
            throw e
        }
    };
    

}