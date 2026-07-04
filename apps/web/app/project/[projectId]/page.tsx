"use client"

import { useParams } from "next/navigation"

export default function ProjectPage(){
    const params = useParams()
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Project Details</h1>
            <p className="mt-4">Project ID:</p>
            <pre className="mt-2 rounded bg-muted p-4">{params.projectId}</pre>
        </div>
    )
}