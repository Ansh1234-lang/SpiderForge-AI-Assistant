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
    ".turbo",
    ".vercel",
    "out",
  ];

  private static ALLOWED_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".html",
    ".css",
    ".scss",
    ".prisma",
    ".yml",
    ".yaml",
  ];

  private static IGNORED_FILES = [
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
  ];

  private static MAX_FILE_SIZE = 1024 * 1024;

  static async scanRepository(
    repoPath: string
  ): Promise<RepositoryFile[]> {
    const files: RepositoryFile[] = [];


    await this.scanDirectory(
      repoPath,
      files
    );

    return files;
  }

  private static async scanDirectory(
    currentPath: string,
    files: RepositoryFile[]
  ): Promise<void> {
    const entries = await fs.readdir(
      currentPath,
      {
        withFileTypes: true,
      }
    );

    for (const entry of entries) {
      const fullPath = path.join(
        currentPath,
        entry.name
      );
      if (
        entry.isDirectory() &&
        this.IGNORE_DIRS.includes(
          entry.name
        )
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.scanDirectory(
          fullPath,
          files
        );
        continue;
      }
      if (
        this.IGNORED_FILES.includes(
          entry.name
        )
      ) {
        continue;
      }

      const extension =
        path.extname(entry.name);
      if (
        !this.ALLOWED_EXTENSIONS.includes(
          extension
        )
      ) {
        continue;
      }

      try {
        const stat =
          await fs.stat(fullPath);
        if (
          stat.size >
          this.MAX_FILE_SIZE
        ) {
          continue;
        }

        const content =
          await fs.readFile(
            fullPath,
            "utf-8"
          );
        if (!content.trim()) {
          continue;
        }
        files.push({
          path: fullPath,
          content,
        });
      } catch (error) {
        console.error(
          `Failed to read file: ${fullPath}`,
          error
        );
      }
    }
  }
}
