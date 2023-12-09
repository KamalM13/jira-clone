import Link from "next/link"
import Image from "next/image"
import { Poppins } from "next/font/google"

import { cn } from "@/lib/utils"

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

export const Logo = () => { 
    return (
        <Link href = "/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image src="/logo.svg" alt="logo" width={30} height={30} />
                <p className={cn("text-lg text-neutral-700 pb-1",poppins.className)}> 
                    Jira Clone
                </p>
            </div>
        </Link>
    )
}