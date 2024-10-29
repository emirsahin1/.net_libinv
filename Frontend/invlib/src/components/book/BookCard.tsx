import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Book } from '@/types/Book'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'

export default function BookCard(book: Book) {
    const router = useRouter();

    const handleBookClick = () => {
        router.push(`/book?id=${book.id}`)
    }

    return (
        <Card className='w-36 cursor-pointer bg-slate-50' onClick={handleBookClick}>
            <CardHeader>
            <div className="flex flex-col space-y-1.5 justify-center">
                <CardTitle>{book.title}</CardTitle>
                <Label>By: {book.author}</Label>
                <Label>{book.category}</Label>
                <AspectRatio ratio={10 / 15}>
                    <img src={book.coverImage}
                        width={200} height={300} alt="Image" className="rounded-md object-cover" />
                </AspectRatio>
            </div>
            </CardHeader>
        </Card>
    )
}
