'use client'
import { Book } from '@/types/Book';
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Star, Calendar, Book as BookIcon, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { checkoutBook, getBook, getReviews, submitReview } from '@/api/book_api';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';

export default function UserBookView() {
    const [id, setId] = useState<number | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState<Review>({ title: '', rating: 0, description: '', bookId: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRatingChange = (value: string) => {
        setNewReview(prev => ({ ...prev, rating: parseInt(value) }))
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewReview(prev => ({ ...prev, description: event.target.value }))
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewReview(prev => ({ ...prev, title: event.target.value }))
    }

    const handleSubmitReview = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await submitReview(newReview)
            if (response) {
                setReviews(prev => [...prev, response])
                setNewReview({ title: '', rating: 0, description: '', bookId: id })
            }
        } catch (error) {
            console.error('Error submitting review:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const checkout = async () => {
        try {
            const resp = await checkoutBook(id)
            if (resp)
                book.isAvailable = false
                loadBook()
        } catch (error) {
            console.error('Error checking out book:', error)
        }
    }

    const loadBook = useCallback(async () => {
        if (!id) return;
        
        try {
            const bookData = await getBook(id);
            if (bookData) {
                setBook(bookData);
            }
            
            const reviewsData = await getReviews(id);
            if (reviewsData) {
                setReviews(reviewsData);
            }
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    useEffect(() => {}, [book])
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id: number = Number(urlParams.get('id'));
        setId(id);
        setNewReview(prev => ({ ...prev, bookId: id }))
    }, []);

    useEffect(() => {
        loadBook();
    }, [id, loadBook]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                            <img
                                src={book?.coverImage}
                                alt={`Cover of ${book?.title}`}
                                width={300}
                                height={450}
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="w-full md:w-2/3">
                            <h1 className="text-3xl font-bold mb-2">{book?.title}</h1>
                            <p className="text-xl text-muted-foreground mb-4">by {book?.author}</p>
                            <div className="flex items-center mb-4">
                                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                <span className="text-lg font-semibold">{book?.averageRating?.toFixed(1)}</span>
                            </div>
                            <p className="text-muted-foreground mb-4">{book?.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{book?.publicationDate}</span>
                                </div>
                                <div className="flex items-center">
                                    <BookIcon className="w-5 h-5 mr-2" />
                                    <span>{book?.pageCount} pages</span>
                                </div>
                                <div className="flex items-center">
                                    <Hash className="w-5 h-5 mr-2" />
                                    <span>{book?.isbn}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Badge className="bg-gray-500" variant={book?.isAvailable ? "default" : "secondary"}>
                                    {book?.isAvailable ? "Available" : "Not Available"}
                                </Badge>
                            </div>
                            <Button className="mt-4" disabled={!book?.isAvailable} onClick={ checkout }>Checkout Book</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={newReview.title}
                                onChange={handleTitleChange}
                                placeholder="Enter your review title..."
                                className="mt-1"
                            />
                            <Label htmlFor="rating">Rating</Label>
                            <RadioGroup
                                id="rating"
                                value={newReview.rating.toString()}
                                onValueChange={handleRatingChange}
                                className="flex space-x-2"
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <div key={value} className="flex items-center space-x-1">
                                        <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                                        <Label htmlFor={`rating-${value}`}>{value}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div>
                            <Label htmlFor="comment">Your Review</Label>
                            <Textarea
                                id="comment"
                                value={newReview.description}
                                onChange={handleCommentChange}
                                placeholder="Write your review here..."
                                className="mt-1"
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {reviews.map((review) => (
                        <div key={reviews.indexOf(review)} className="mb-6 pb-6 border-b last:border-b-0">
                            <div className="flex items-center mb-2">
                                <div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{review.title}</h3>
                            <p className="text-muted-foreground">{review.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
