"use server"

import { auth } from "@clerk/nextjs"
import { InputType } from "./types"
import { ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { DeleteBoard } from "./schema"
import { redirect } from "next/navigation"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()
    
    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { id } = data
    let board

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            },
        })
    } catch (error){
        return {
            error: "Unable to delete board"
        }
    }

    revalidatePath(`/organiztion/${orgId}`)
    redirect(`/organization/${orgId}`)
}
 
export const deleteBoard = CreateSafeActions(DeleteBoard,handler)