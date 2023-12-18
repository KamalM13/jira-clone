import { AuditLog } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { generateLogMessage } from "@/lib/generate-log-message"

interface ActivityItemProps {
    data: AuditLog
}

const formatDate = (inputDate:Date) => {
    const date = new Date(inputDate);

    // Extracting date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = (hours % 12) || 12;

    // Creating the formatted date string
    const formattedDate = `${year}-${month}-${day} at ${hours}:${minutes}:${seconds} ${meridiem}`;

    return formattedDate;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
    const date = formatDate(data.createdAt);
    return (
        <li className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data?.userImage} />
            </Avatar>
            <div className=" flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold lowercase text-neutral-700">
                        {data.userName + " "}
                    </span>{generateLogMessage(data)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {date}
                </p>
            </div>
        </li>
    )
}