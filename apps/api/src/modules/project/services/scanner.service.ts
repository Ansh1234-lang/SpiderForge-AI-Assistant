import fs from "fs/promises";
import path from "path";

export interface RepositoryFile {
  path: string;
  content: string;
}

export class ScannerService {
  private static IGNORE_DIRS = [
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
  ];

  static async scanRepository(
    repoPath: string
  ): Promise<RepositoryFile[]> {
    const files: RepositoryFile[] = [];

    await this.scanDirectory(repoPath, files);

    return files;
  }

  private static async scanDirectory(
    currentPath: string,
    files: RepositoryFile[]
  ) {
    const entries = await fs.readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(
        currentPath,
        entry.name
      );

      if (
        entry.isDirectory() &&
        this.IGNORE_DIRS.includes(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.scanDirectory(
          fullPath,
          files
        );
      } else {
        try {
          const content =
            await fs.readFile(
              fullPath,
              "utf-8"
            );

          files.push({
            path: fullPath,
            content,
          });
        } catch {
          // skip binary files
        }
      }
    }
  }
}