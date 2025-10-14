"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { authClient } from "../lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={(path)=>router.push(path)}
            replace={(path)=>router.replace(path)}
            onSessionChange={async () => {
                // Clear router cache (protected routes)
                router.refresh();
                try {
                    const session = await authClient.getSession();
                    if(session.data?.user && typeof window!=="undefined"){
                        const currentPath= window.location.pathname;
                        if (currentPath.startsWith('/auth/')) {
                            router.push('/dashboard');
                        }
                    }
                } catch (error) {
                    console.log("Session Check failed!", error)
                }
            }}
            Link={Link}
        >
            {children}
        </AuthUIProvider>
    )
}