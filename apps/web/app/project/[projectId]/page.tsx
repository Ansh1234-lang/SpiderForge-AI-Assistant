"use client"

import { useParams } from "next/navigation"
import { useCloneProject } from "@/hooks/useCloneProject"

export default function ProjectPage() {
    const params = useParams()
    const projectId = params.projectId as string
    const cloneMutation = useCloneProject();

    const handleClone = () => {
        cloneMutation.mutate(projectId, {
            onSuccess: (data) => {
                console.log(data);
                alert("Repository cloned Successfull")
            },
            onError: (e) => {
                console.error(e)
                alert("Clone Failed")
            }
        })
    }
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Project Details</h1>
            <p className="mt-4">Project ID:</p>
            <pre className="mt-2 rounded bg-muted p-4">{params.projectId}</pre>
            <button
                onClick={handleClone}
                disabled={cloneMutation.isPending}
                className="mt-6 rounded bg-black px-5 py-2 text-white">
                {cloneMutation.isPending ? "cloning...." : "clone repository"}
            </button>
        </div>
    )
}