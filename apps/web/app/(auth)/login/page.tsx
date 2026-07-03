"use client";

import { useState } from "react"
import { AuthService } from "@/services/auth.service";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";




export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setloading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            setloading(true);

            const response = await AuthService.login({
                email, password
            })
            auth.saveToken(response.accessToken);
            auth.saveUser(response.user);

            router.push("/dashboard")
        } catch (e) {
            console.error(e)
            alert("Login Failed")
        } finally {
            setloading(false);
        }
    }
    return (
        <div className="flex min-h-screen item-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4 w-96 rounded-lg border p-6">
                <h1 className="text-2xl font-bold">Login</h1>
                <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full rounded border p-2" type="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full rounded bg-black p-2 text-white" disabled={loading}>
                    {loading ? "Logging in....":"Login"}
                </button>
            </form>
        </div>
    )
}

