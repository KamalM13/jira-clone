"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CreateSafeActions } from "@/lib/create-safe-actions"
import { CreateBoard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "You must be logged in to create a board"
        }
    }

    const { title, image } = data

    const [
        imageId,
        imageSmallUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUserName,
    ] = image.split("|")

    if (!imageId || !imageSmallUrl || !imageFullUrl || !imageLinkHtml || !imageUserName) { 
        return {
            error: "Invalid image"
        }
    }

    let board
    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageSmallUrl,
                imageFullUrl,
                imageLinkHtml,
                imageUserName,
                
            }
        })
    } catch (error) {
        return {
            error: "Failed to create board"
        }
    }
    revalidatePath(`/board/${board.id}`)
    return { data: board }
}

export const createBoard = CreateSafeActions(CreateBoard, handler)