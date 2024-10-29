export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    publisher: string;
    publicationDate: string;
    category: string;
    pageCount: number;
    isbn: string;
    isAvailable: boolean;
    averageRating: number;
}