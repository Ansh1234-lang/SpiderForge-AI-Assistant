import {useMutation} from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useCloneProject(){
    return useMutation({
        mutationFn:(projectId:string)=>
            ProjectService.cloneProject(projectId) 
    })
}