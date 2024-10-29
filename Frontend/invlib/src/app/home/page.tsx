'use client'
import React, { useEffect } from 'react'
import withAuth from '../../lib/AuthProvider'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BookCard from '@/components/book/BookCard';
import { Separator } from '@/components/ui/separator';
import { getBooks } from '@/api/book_api';
import { Book } from '@/types/Book';

function Home() {
  const [books, setBooks] = useState<Book[]>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    getBooks(searchQuery).then((data) => {
      if (data){
        setBooks(data);
      }
    })
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-6">
      <section className="flex flex-col items-center my-10">
        <Label htmlFor="search" className="text-2xl font-medium mb-2">
          Search for Books
        </Label>
        <Input
          id="search"
          placeholder="Type a book title..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </section>
      <Separator className='mb-10'></Separator>
      <section>
        <h2 className="text-xlfont-semibold text-center mb-4">Search Results</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {books?.length > 0 ? (
            books?.map((book) => (
              <BookCard key={book.id} {...book} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No books found for "{searchQuery}"
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default withAuth(Home)