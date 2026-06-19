import axios from "axios";

export class GithubService {
    static async validateRepo(
        owner:string,
        repo:string,
    )
    {
        console.log(owner,repo)
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}`
        );
        return response.data;
    }
}