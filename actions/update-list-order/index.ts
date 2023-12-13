"use server"

import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { CreateSafeActions } from "@/lib/create-safe-actions"

import { InputType } from "./types"
import { ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { UpdateListOrder } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { items, boardId } = data
    let lists

    try {
        const transaction = items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId,
                    }
                },
                data: {
                    order: list.order
                }
            })
        )

        lists = await db.$transaction(transaction)
    } catch (error) {
        return {
            error: "Unable to reorder lists"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: lists }
}

export const updateListOrder = CreateSafeActions(UpdateListOrder, handler)