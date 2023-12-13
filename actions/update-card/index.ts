"use server"

import { auth } from "@clerk/nextjs"
import { InputType } from "./types"
import { ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { UpdateCard } from "./schema"
import { values } from "lodash"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()
    
    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { id,boardId,...values } = data
    let card

    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board:{
                        orgId,
                    }
                }
            },
            data: {
                ...values
            }
        })
    } catch (error){
        return {
            error: "Unable to update board"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:card}
}
 
export const updateCard = CreateSafeActions(UpdateCard,handler)