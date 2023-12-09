import Link from "next/link";
import { Poppins } from "next/font/google";
import { Link as LucideLink, Medal, Weight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

const MarketingPage = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn("flex items-center justify-center flex-col font-bold", poppins.className,)}>
                <div className="mb-4 flex items-center border shadow-sm p-4
                 bg-test1 text-test2 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    Task Management Tool
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    Manage your tasks with ease
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r
                from-fuchsia-600 to-pink-600 text-white px-4 p-3 rounded-md pb-3 w-fit ">
                    work forward.
                </div>
            </div>
            <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
                Collabrate, manage, and organize your projects with ease. From freelancing projects to
                managing your team, we got you covered. Acomplish more with less effort.
            </div>
            <Button className="mt-3" size="lg">
                <Link href="/sign-up">
                    Get Started
                </Link>
                <LucideLink className="ml-1" />
            </Button>
        </div>
    );
};
export default MarketingPage;