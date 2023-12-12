"use client"

import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"

import { unsplash } from "@/lib/unsplash"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { defaultImages } from "@/constants/images"
import { FormErrors } from "./form-errors"

interface FormPickerProps {
    id: string,
    errors?: Record<string, string[] | undefined>,
}

export const FormPicker = ({
    id,
    errors,
}: FormPickerProps) => {
    const { pending } = useFormStatus()
    const [images, setImages] = useState<Array<Record<string, any>>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedImage, setSelectedImage] = useState<string>("")
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                })
                if (result && result.response) {
                    setImages(result.response as Array<Record<string, any>>)
                }
                else {
                    console.error("No response from Unsplash")
                }
            } catch (error) {
                console.log(error)
                setImages([defaultImages])
            } finally {
                setIsLoading(false)
            }
        }

        fetchImages()
    }, [])
    if (isLoading) {
        <div className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-sky-500 animate-spin" />
        </div>
    }
    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            if (!pending) {
                                setSelectedImage(image.id)
                            }
                        }}
                    >
                        <input
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImage === image.id}
                            onChange={() => { }}
                            disabled={pending}
                            value={`${image.id}
                            |${image.urls.small}
                            |${image.urls.full}
                            |${image.links.html}
                            |${image.user.name}`}
                        />
                        <Image
                            src={image.urls.small}
                            fill
                            alt="Unsplash Image"
                            className="object-cover rounded-sm"
                        />
                        {selectedImage === image.id && (
                            <div className="absolute inset-y-0 h-full w-full bg-black/30
                            flex items-center justify-center">
                                <Check className="h-6 w-6 text-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <FormErrors
                id="image"
                errors={errors}
            />
        </div >
    )
}