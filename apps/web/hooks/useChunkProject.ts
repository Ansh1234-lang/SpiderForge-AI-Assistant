import { ProjectService } from "@/services/project.service";
import { useMutation } from "@tanstack/react-query";

export function useChunkProject(){
    return useMutation({
        mutationFn:(projectId:string)=>
            ProjectService.chunkProject(projectId)
    })
}