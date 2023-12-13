"use client"

import { FormSubmit } from "@/components/form/form-submit"
import { Button } from "@/components/ui/button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { List } from "@prisma/client"
import { MoreHorizontal, Trash, X } from "lucide-react"
import { useAction } from "@/hooks/use-action"
import { deleteList } from "@/actions/delete-list"
import { toast } from "sonner"
import { ElementRef, useRef } from "react"


interface ListOptionsProps {
    data: List
    onAddCard: () => void
}

export const ListOptions = ({
    data,
    onAddCard
}: ListOptionsProps) => {

    const closeRef = useRef<ElementRef<"button">>(null)

    const { execute: executeDeleteList } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List ${data.title} deleted successfully`)
            closeRef.current?.click()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onDeleteList = (formData: FormData) => {
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string
        executeDeleteList({ id, boardId })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="h-auto w-auto p-2" variant={"ghost"}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List Actions
                </div>
                <PopoverClose ref={closeRef } asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant={"ghost"}
                        size={"sm"}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </PopoverClose>
                <Button onClick={onAddCard}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start text-sm"
                    variant={"ghost"}
                >
                    Add Card..
                </Button>
                <form action={onDeleteList}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input hidden name="boardId" id="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-md w-auto h-auto p-1.5 px-2 text-sm text-white bg-rose-500
                        absolute top-3 left-3"
                    >
                        <Trash className="w-4 h-4" />
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}