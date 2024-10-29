'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteBook, getBook, updateBook } from '@/api/book_api'
import { useRouter } from 'next/navigation'

interface Book {
    id: number
    title: string
    author: string
    description: string
    coverImage: string
    publisher: string
    publicationDate: string
    category: string
    pageCount: number
    isbn: string
    isAvailable: boolean
    averageRating: number
}

export default function BookManagerView() {
    const [book, setBook] = useState<Book>({
        id: 0,
        title: '',
        author: '',
        description: '',
        coverImage: '',
        publisher: '',
        publicationDate: '',
        category: '',
        pageCount: 0,
        isbn: '',
        isAvailable: true,
        averageRating: 0,
    })

    const [id, setId] = useState<number | null>(null);
    const router = useRouter();

    const loadBook = useCallback(async () => {
        if (!id) return;
        try {
            const bookData = await getBook(id);
            if (bookData) {
                try {
                bookData.publicationDate = new Date(bookData.publicationDate)?.toISOString()?.split('T')[0]
                } catch (error) {
                    console.log(error)
                }
                setBook(bookData);
            }
            else{
                router.push('/home');
            }
        } catch (error) {
            router.push('/home');
        }
    }, [id, router]);


    useEffect(() => { }, [book])
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id: number = Number(urlParams.get('id'));
        setId(id);
    }, []);

    useEffect(() => {
        loadBook();
    }, [id, loadBook]);


    useEffect(() => {
    }, [book])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setBook(prev => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (checked: boolean) => {
        setBook(prev => ({ ...prev, isAvailable: checked }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateBook(book)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Book Manager</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={book.title} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" value={book.author} onChange={handleInputChange} />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={book.description} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="coverImage">Cover Image URL</Label>
                                <Input id="coverImage" name="coverImage" value={book.coverImage ? book.coverImage : ''} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input id="publisher" name="publisher" value={book.publisher} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="publicationDate">Publication Date</Label>
                                <Input id="publicationDate" name="publicationDate" type="date" value={book.publicationDate} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" value={book.category} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="pageCount">Page Count</Label>
                                <Input id="pageCount" name="pageCount" type="number" value={book.pageCount} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input id="isbn" name="isbn" value={book.isbn} onChange={handleInputChange} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="isAvailable" checked={book.isAvailable} onCheckedChange={handleSwitchChange} />
                                <Label htmlFor="isAvailable">Available</Label>
                            </div>
                        </div>
                        <Button type="submit">Save Changes</Button>
                        <Button className="ml-5 bg-red-500 hover:bg-red-600" 
                        type="submit"
                        onClick={() => {
                            deleteBook(book.id)
                            router.push('/home')
                        }}
                        >
                            Delete Book
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}