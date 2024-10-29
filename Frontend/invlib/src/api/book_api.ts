import { Book } from "@/types/Book"


const buildQueryParams = (
    searchQuery: string = "", 
    titleStartLetter: string = "",
    authorStartLetter: string = "",
    availability: string = "",
    sortOrder: string = "asc"
) => {
    const queryParams: Record<string, string> = {};
    if (searchQuery) queryParams.titleSearch = searchQuery;
    if (titleStartLetter) queryParams.titleStartLetter = titleStartLetter;
    if (authorStartLetter) queryParams.authorStartLetter = authorStartLetter;
    if (availability) queryParams.availability = availability;
    if (sortOrder) queryParams.sortOrder = sortOrder;
    return new URLSearchParams(queryParams).toString();
}


export const getBooks = async (searchQuery: string = "",
    titleStartLetter: string = "",
    authorStartLetter: string = "",
    availability: string = "",
    sortOrder: string = "asc",
    featured:boolean = false,
) => {
    
    const queryString = buildQueryParams(searchQuery, 
        titleStartLetter, authorStartLetter, availability, sortOrder)
        
    const url = featured ? `${process.env.NEXT_PUBLIC_API_URL}/api/Books/featured?${queryString}` : 
                           `${process.env.NEXT_PUBLIC_API_URL}/api/Books/?${queryString}`

    const res = await fetch(`${url}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const books: Book[] = await res.json()
    return books;
}

export const getBook = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Books/${id}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    if (!res.ok) {
        return null
    }
    const book: Book = await res.json()
    return book;
}

export const getReviews = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Reviews/book/${id}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const reviews = await res.json()
    return reviews;
}

export const submitReview = async (review: Review) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Reviews`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const newReview = await res.json()
    return newReview;
}

export const checkoutBook = async (bookId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Checkout`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bookId}),
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const checkout = await res.json()
    return checkout;
}

export const deleteBook = async (bookId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Books/${bookId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const deletedBook = await res.json()
    return deletedBook;
}

export const updateBook = async (book: Book) => {
    book.publicationDate = new Date(book.publicationDate).toISOString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Books/${book.id}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
            signal: AbortSignal.timeout(6000),
            credentials: 'include',
        })
    const updatedBook = await res.json()
    return updatedBook;
}