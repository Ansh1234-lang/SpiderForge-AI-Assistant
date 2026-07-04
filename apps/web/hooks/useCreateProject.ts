import { useMutation,useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useCreateProject(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:ProjectService.createProject,

        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:["projects"],
            })
        }
    })
}