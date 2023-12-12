"use server"

import { auth } from "@clerk/nextjs"
import { InputType } from "./types"
import { ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { UpdateBoard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()
    
    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { title, id } = data
    let board

    try {
        board = await db.board.update({
            where: {
                id,
                orgId
            },
            data: {
                title,
            }
        })
    } catch (error){
        return {
            error: "Unable to update board"
        }
    }

    revalidatePath(`/board/${id}`)
    return {data:board}
}
 
export const updateBoard = CreateSafeActions(UpdateBoard,handler)