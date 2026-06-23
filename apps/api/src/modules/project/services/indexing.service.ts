import path from "path";
import { prisma } from "../../../lib/prisma";
import { ScannerService } from "./scanner.service";
import { chunkService } from "./chunk.service";
import { EmbeddingService } from "./embedding.service";

export class IndexingService {
  static async indexRepository(
    projectId: string
  ) {
    const repoPath = path.join(
      process.cwd(),
      "..",
      "..",
      "storage",
      "repositories",
      projectId
    );

    const files =
      await ScannerService.scanRepository(
        repoPath
      );

    const chunks =
      chunkService.chunkFiles(files);

    await prisma.chunk.deleteMany({
      where: {
        projectId,
      },
    });

    await prisma.chunk.createMany({
      data: chunks.map((chunk) => ({
        projectId,
        filePath: chunk.filePath,
        content: chunk.content.replace(/\0/g, ""),
        chunkIndex: chunk.chunkIndex,
      })),
    });

    return {
      files: files.length,
      chunks: chunks.length,
    };
  }
}