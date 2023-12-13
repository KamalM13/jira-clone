"use client"

import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { ListWithCards } from "@/types"
import { List } from "@prisma/client"
import { ListForm } from "./list-form"
import { useEffect, useState } from "react"
import { ListItem } from "./list-item"
import { useAction } from "@/hooks/use-action"
import { updateListOrder } from "@/actions/update-list-order"
import { updateCardOrder } from "@/actions/update-card-order"
import { toast } from "sonner"
interface ListContainerProps {
    boardId: string
    data: ListWithCards[]
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export const ListContainer = ({
    boardId, data
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data)
    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List order updated")
        },
        onError: (error) => {
            toast.error(error)
        }
    })
    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Carder order updated")
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    useEffect(() => {
        setOrderedData(data)
    }, [data])

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result

        if (!destination) return

        // Dropped in the same place
        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return

        // Moving a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((list, index) => ({ ...list, order: index }))
            setOrderedData(items)
            executeUpdateListOrder({ items, boardId })
        }

        // User moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData]
            const sourceList = newOrderedData.find(list => list.id === source.droppableId)
            const destList = newOrderedData.find(list => list.id === destination.droppableId)
            if (!sourceList || !destList) return

            //If cards exist in source
            if (!sourceList.cards.length) {
                sourceList.cards = []
            }

            //If cards exist in dest
            if (!sourceList.cards.length) {
                destList.cards = []
            }

            // Moving in the same list
            if (source.droppableId === destination.droppableId) {
                const newCardOrder = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                ).map((card, index) => ({ ...card, order: index }))
                sourceList.cards = newCardOrder

                setOrderedData(newOrderedData)
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: newCardOrder
                })
            }


            //Moving to another list
            if (source.droppableId !== destination.droppableId) {
                const [removed] = sourceList.cards.splice(source.index, 1)
                removed.listId = destList.id
                destList.cards.splice(destination.index, 0, removed)
                sourceList.cards.forEach((card, index) => { 
                    card.order = index
                })
                destList.cards.forEach((card, index) => { 
                    card.order = index
                })
                setOrderedData(newOrderedData)
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.cards
                })
            }
            
        }


    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full">
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>)}
            </Droppable>
        </DragDropContext>
    )
}
