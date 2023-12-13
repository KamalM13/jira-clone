"use server"

import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { CreateSafeActions } from "@/lib/create-safe-actions"

import { InputType } from "./types"
import { ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { UpdateCardOrder } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { items, boardId} = data
    let updatedCards

    try {
        const transaction = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId,
                        }
                    }
                },
                data: {
                    order: card.order,
                    listId: card.listId
                }
            }))
        
        updatedCards = await db.$transaction(transaction)
    } catch (error) {
        return {
            error: "Unable to reorder cards"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: updatedCards }
}

export const updateCardOrder = CreateSafeActions(UpdateCardOrder, handler)