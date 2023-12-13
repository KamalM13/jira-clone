"use server"

import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { CreateSafeActions } from "@/lib/create-safe-actions"

import { InputType } from "./types"
import { ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { CreateList } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()
    
    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { title, boardId } = data
    let list

    try {
        const currentBoard = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            }
        })
        if (!currentBoard) return { "error": "Board not found" }
        
        const lastList = await db.list.findFirst({
            where: {
                boardId: boardId
            },
            orderBy: {
            order: "desc"
            },
            select: {
                order:true
            }
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                boardId,
                title,
                order: newOrder
            }
        })
    } catch (error){
        return {
            error: "Unable to create board"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}
 
export const createList = CreateSafeActions(CreateList,handler)