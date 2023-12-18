"use server"

import { auth } from "@clerk/nextjs"
import { InputType } from "./types"
import { ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { UpdateList } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()
    
    if (!userId || !orgId) return {
        error: "Unauthorized"
    }

    const { title, id,boardId } = data
    let list

    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                }
            },
            data: {
                title,
            }
        })
        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        })
    } catch (error){
        return {
            error: "Unable to update board"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}
 
export const updateList = CreateSafeActions(UpdateList,handler)