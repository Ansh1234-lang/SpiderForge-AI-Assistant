import { RepositoryFile } from "./scanner.service";

export interface codeChunk{
    filePath:string,
    content : string,
    chuckIndex :number,
}

export class chunkService{
    static chunkFiles(
        files:RepositoryFile[],
        chunkSize =1000
    ):codeChunk[]{
        const chunks:codeChunk[]=[];
        for (const file of files){
            const content = file.content;
            for (let i = 0 ;i < content.length; i += chunkSize){
                chunks.push({
                    filePath:file.path,
                    content:content.slice(
                        i,i+chunkSize
                    ),
                    chuckIndex:Math.floor(i/chunkSize)
                })
            }
        }
        return chunks
    }
}