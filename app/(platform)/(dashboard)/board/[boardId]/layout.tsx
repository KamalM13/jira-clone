import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { BoardNavBar } from "./_components/board-navbar"

export async function generateMetadata({ params }: {
    params: { boardId: string }
}) {
    const { orgId } = auth()
    if (!orgId) return { title: "Board" }
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    })
    return {
        title: board?.title || "Board"
    }
}


const BoardIdLayout = async ({
    children,
    params
}: {
    children: React.ReactNode
    params: { boardId: string }
}) => {

    const { orgId } = auth()
    if (!orgId) return redirect("/select-org")

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    })

    if (!board) notFound()
    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavBar data={board} />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900 opacity-30" />
            <main className="relative pt-30 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout