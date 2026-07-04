"use client";

import { useProjects } from "@/hooks/useProjects";
import NewProjectDialog from "@/components/project/new-project-dialog";

export default function DashboardPage() {
    const { data, isLoading, isError } = useProjects();

    if (isLoading) {
        return (
            <div className="p-8">
                Loading projects...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-red-500">
                Failed to load projects.
            </div>
        );
    }

    const projects = data?.data ?? [];

    return (
        <div className="min-h-screen p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your AI code analysis projects.
                    </p>
                </div>
                <NewProjectDialog />
            </div>

            {projects.length === 0 ? (
                <div className="rounded-lg border p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No Projects Yet
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        Create your first GitHub project to begin analyzing code.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project: any) => (
                        <div
                            key={project.id}
                            className="rounded-lg border p-5"
                        >
                            <h2 className="text-xl font-semibold">
                                {project.name}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {project.githubUrl}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}