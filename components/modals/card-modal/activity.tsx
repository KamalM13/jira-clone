"use client"

import { ActivityItem } from "@/components/activity-item"
import { Skeleton } from "@/components/ui/skeleton"
import { AuditLog } from "@prisma/client"
import { ActivityIcon } from "lucide-react"

interface activityProps {
    items: AuditLog[]
}

export const Activity = ({ items }: activityProps) => {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="w-5 h-5 text-neutral-700" />
            <div className="w-full ">
                <p className=" font-semibold text-neutral-700 pb-3">Activity</p>
                <ol className="mt-2 space-y-4">
                    {items.map((item) => (
                        <ActivityItem key={item.id} data={item} />
                    ))}

                </ol>
            </div>
        </div>
    )
}

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="w-8 h-8 rounded-full bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-28 h-6 rounded-full mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-12 rounded-full bg-neutral-200" />
            </div>
        </div>
    )
}