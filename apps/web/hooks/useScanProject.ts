import { useMutation } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";

export function useScanProject() {
    return useMutation({
        mutationFn: (projectId: string) =>
            ProjectService.scanProject(projectId),
    })
}