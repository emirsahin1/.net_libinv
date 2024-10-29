import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import BookCard from './BookCard';
import { Book } from '@/types/Book';
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '../ui/checkbox';
import { getBooks } from '@/api/book_api';

const alphabet = ["None" ,...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

export default function FeaturedBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [titleStartLetter, setTitleStartLetter] = useState<string>("");
    const [authorStartLetter, setAuthorStartLetter] = useState<string>("");
    const [availability, setAvailability] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const handleFilter = (e: string) => {
        if (e === "None") 
            setTitleStartLetter("");
        else
            setTitleStartLetter(e);
    }

    const handleAuthorFilter = (e: string) => {
        if (e === "None") 
            setAuthorStartLetter("");
        else
            setAuthorStartLetter(e);
    }

    const handleAvailabilityFilter = (e: string) => {
        setAvailability(e);
    }

    const handleSortOrder = (e: string) => {
        setSortOrder(e);
    }


    useEffect(() => {
        getBooks("", titleStartLetter, authorStartLetter, availability, sortOrder, true).then((data) => {
            if (data) {
                setBooks(data);
            }
        })
    }, [titleStartLetter, authorStartLetter, availability, sortOrder])

    return (
        <Card className="mb-6">
            <h2 className="text-2xl text-center my-4">Monthly Featured Books</h2>
            <Separator className='mx-auto w-2/4 mb-6' />
            <div className="mx-2 mb-4 flex justify-center gap-3 flex-wrap flex-row">
                <Select onValueChange={handleFilter} value={titleStartLetter}>
                    <SelectTrigger className='w-1/4'>
                        <SelectValue placeholder="Filter Title" />
                    </SelectTrigger>
                    <SelectContent>
                        {alphabet.map((letter) => (
                            <SelectItem key={letter} value={letter}>
                                {letter}
                            </SelectItem>
                        ))
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={handleAuthorFilter} value={authorStartLetter}>
                    <SelectTrigger className='w-1/4'>
                        <SelectValue placeholder="Filter Author" />
                    </SelectTrigger>
                    <SelectContent>
                        {alphabet.map((letter) => (
                            <SelectItem key={letter} value={letter}>
                                {letter}
                            </SelectItem>
                        ))
                        }
                    </SelectContent>
                </Select>
                <Select onValueChange={handleSortOrder}>
                    <SelectTrigger className='w-1/4'>
                        <SelectValue placeholder="Sort Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>
                <div className="items-top flex space-x-2 justify-center items-center">
                    <Checkbox id="avail"
                    checked={availability === "true"}  
                    onCheckedChange={(e) => handleAvailabilityFilter(e ? "true" : "false")} />
                    <label
                        htmlFor="avail"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Availability
                    </label>
                </div>
            </div>
            <CardContent>
                <div className="flex flex-wrap justify-center gap-4">
                    {books.map((book) => (
                        <BookCard key={book.id} {...book}></BookCard>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
