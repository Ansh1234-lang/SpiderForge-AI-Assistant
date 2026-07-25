"use client"

import { useParams } from "next/navigation"
import { useCloneProject } from "@/hooks/useCloneProject"
import { useScanProject } from "@/hooks/useScanProject"
import { useState } from "react"
import { useChunkProject } from "@/hooks/useChunkProject"

export default function ProjectPage() {
    const params = useParams()
    const projectId = params.projectId as string
    const [scanResults, setScanResults] = useState<any[]>([]);
    const [chunksResults,setChunkResults] = useState<any[]>([])

    const cloneMutation = useCloneProject();
    const scanMutation = useScanProject()
    const chunkMutation = useChunkProject()

    // clone handler


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
    // scan handler

    const handleScan = () => {

        console.log("Scan button clicked")
        scanMutation.mutate(projectId, {
            onSuccess: (data) => {
                console.log(data)
                setScanResults(data.data)
                alert("Repository scanned Successfully")
            },
            onError: (e) => {
                console.error(e)
                alert("scan failed")
            }
        })
    }
    // chunk hander
    const handleChunk = ()=>{
        chunkMutation.mutate(projectId,{
            onSuccess:(data)=>{
                console.log(data)
                setChunkResults(data.data|| [])
                alert("repository chunked successfully")
            },
            onError :(e)=>{
                console.error(e)
                alert("Chunking failed")
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
            <button
                onClick={handleScan}
                disabled={scanMutation.isPending}
                className="rounded bg-black px-5 py-2 text-white ml-3">
                {scanMutation.isPending ? "Scanning...." : "Scan repository"}
            </button>
            {scanResults.length > 0 && (
                <div className="mt-8 border rounded-lg p-4 relative">
                    <button
                    onClick={()=>setScanResults([])}
                    className="absolute top-2 right-2 text-red-500 font bold">
                        ❌
                    </button>
                    <h2 className="text-xl font-bold mb-4">
                        Scan Results
                    </h2>

                    {scanResults.map((file, index) => (
                        <div
                            key={index}
                            className="border rounded p-3 mb-2"
                        >
                            <pre>
                                {JSON.stringify(file, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            )}
            <button
            onClick={handleChunk}
            disabled={chunkMutation.isPending}
            className="rounded bg-black px-5 py-2 text-white">
                {chunkMutation.isPending?"chunking...":"generate chunks"}
            </button>
            {chunksResults.length>0 &&(
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Chunk Results</h2>
                <pre>
                    {JSON.stringify(chunksResults,null,2)}
                </pre>
            </div>    
            )}
        </div>
    )
}