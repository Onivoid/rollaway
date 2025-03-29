"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, PartyPopper, MessagesSquare } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const pages = [
    { name: "Home", path: "/", icon: <House /> },
    { name: "Giveaway", path: "/giveaway", icon: <PartyPopper /> },
    { name: "Better Chat", path: "/better-chat", icon: <MessagesSquare /> }
]

export function NavigationComponent (){
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState(pathname);
    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);
    console.log(`NavigationComponent rendered with ${pages.length} pages`);
    return(
        <div className={`grid grid-cols-3 fixed bottom-10 left-[50%] -translate-x-1/2 gap-3`} >
            {pages.map((page) => (
                <TooltipProvider key={page.name}>
                    <Tooltip>
                        <TooltipTrigger className="p-1 group hover:cursor-pointer hover:bg-neutral-900 rounded-md border border-neutral-700 col-span-1">
                            <Link
                                href={page.path}
                                className={`flex items-center justify-center 
                                    ${currentPage === page.path 
                                        ? "text-purple-800 group-hover:text-gray-50" 
                                        : "text-gray-50 group-hover:text-purple-800"
                                    } 
                                    transition-all duration-200 ease-in-out h-10 w-10`}
                            >
                                {page.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>{page.name}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    )
};