using InvLib.Data;
using InvLib.Models;
using Microsoft.EntityFrameworkCore;

namespace InvLib.Services
{
    public class BookService
    {
        private readonly ApplicationDbContext _context;
        public BookService(ApplicationDbContext context) {
            _context = context;
        }

        public IQueryable<Book> BuildBooksQuery(
            string? titleStartLetter = null,
            string? authorStartLetter = null,
            bool? availability = null,
            string sortOrder = "asc",
            string? titleSearch = null
        )
        {
            var booksQuery = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(titleStartLetter))
                booksQuery = booksQuery.Where(book => book.Title.StartsWith(titleStartLetter));

            if (!string.IsNullOrEmpty(authorStartLetter))
                booksQuery = booksQuery.Where(book => book.Author.StartsWith(authorStartLetter));

            if (availability.HasValue)
                booksQuery = booksQuery.Where(book => book.IsAvailable == availability);

            if (!string.IsNullOrEmpty(titleSearch))
                booksQuery = booksQuery.Where(book => book.Title.Contains(titleSearch));

            booksQuery = sortOrder.ToLower() == "desc"
                ? booksQuery.OrderByDescending(book => book.Title)
                : booksQuery.OrderBy(book => book.Title);

            return booksQuery;
        }
    }
}
