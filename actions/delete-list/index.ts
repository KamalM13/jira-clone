"use server"

import { auth } from "@clerk/nextjs"
import { InputType } from "./types"
import { ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { DeleteList } from "./schema"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { createAuditLog } from "@/lib/create-audit-log"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { id, boardId } = data
    let list

    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
        })
        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE
        })
    } catch (error) {
        return {
            error: "Unable to delete list"
        }
    }

    revalidatePath(`/organiztion/${boardId}`)
    return { data: list }
}

export const deleteList = CreateSafeActions(DeleteList, handler)