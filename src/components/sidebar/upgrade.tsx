"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";

export const Upgrade = () => {
    const upgrade= async ()=>{
        await authClient.checkout({
            products: [
                "f5119c28-6493-49e6-97b1-954b570543f1",
                "f4315d31-bc62-4af8-b877-37983bcb62f0",
                "9b2f0c64-c50b-415d-b3a0-e916550acb3e",
            ]
        })
    }
    return ( 
        <Button
        variant="outline"
        size="sm"
        className="group relative ml-2 cursor-pointer overflow-hidden border-orange-400/50 bg-gradient-to-r from-orange-400/10 to-pink-500/10 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
        onClick={upgrade}
        >
        <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-medium">Upgrade</span>
            <Sparkles className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-400/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Button>
     );
}