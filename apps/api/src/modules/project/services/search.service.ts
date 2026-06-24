import { prisma } from "../../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

function cosineSimilarity(
    a: number[],
    b: number[]
) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

export class SearchService {
    static async search(projectId: string, query: string) {
        const queryEmbedding = await EmbeddingService.generateEmbedding(query);
        const chunks = await prisma.chunk.findMany({
            where: {
                projectId,
            }
        });
        const validChunks = chunks.filter((chunk) => chunk.embedding !== null);
        const scoredChunks = validChunks.map((chunk) => ({
            ...chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding as number[])
        }));
        scoredChunks.sort((a, b) => b.score - a.score)
        console.log(scoredChunks.slice(0,5).map(c=>({score:c.score,file:c.filePath})))
        return scoredChunks.slice(0, 5);
    }
}