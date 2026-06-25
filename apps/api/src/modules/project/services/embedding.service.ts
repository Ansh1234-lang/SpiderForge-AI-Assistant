import {GoogleGenAI} from "@google/genai"
import {prisma} from "../../../lib/prisma"

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY!,});

export class EmbeddingService {
  static async embedProject(projectId: string) {
    const chunks = await prisma.chunk.findMany({
      where: {
        projectId,
      },
      // take: 30, //limit the embedding
    });

    for (const chunk of chunks) {
      const embedding =
        await this.generateEmbedding(
          chunk.content
        );

      await prisma.chunk.update({
        where: {
          id: chunk.id,
        },
        data: {
          embedding,
        },
      });
    }

    return chunks.length;
  }

  static async generateEmbedding(
    text: string
  ) {
    const response = await ai.models.embedContent({
      model:"gemini-embedding-001",
      contents:text,
    })
    return response.embeddings?.[0]?.values ?? [];
  }
}