"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/useCreateProject";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewProjectDialog() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const { mutate, isPending } = useCreateProject();

  const handleCreateProject = () => {
    if (!name || !githubUrl) {
      alert("Please fill all fields");
      return;
    }

    mutate(
      {
        name,
        githubUrl,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setGithubUrl("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-md bg-black px-4 py-2 text-white">
          + New Project
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
            className="w-full rounded-md border p-2"
          />

          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="GitHub Repository URL"
            className="w-full rounded-md border p-2"
          />

          <button
            onClick={handleCreateProject}
            disabled={isPending}
            className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Project"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}