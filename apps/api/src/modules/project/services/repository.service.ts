import simpleGit from "simple-git"
import path from "path";

export class RepositoryService {
    static async cloneRepository(
        githubUrl: string,
        projectId: string,
    ) {
        const targetPath = path.join(
            process.cwd(),
            "..",
            "..",
            "storage",
            "repositories",
            projectId
        );
        console.log("clonePath:", targetPath);
        const git = simpleGit()
        await git.clone(githubUrl, targetPath)
        return targetPath
    }

}
