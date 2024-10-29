using AutoMapper;
using InvLib.Data;
using InvLib.Dtos.Book;
using InvLib.Dtos.Review;
using InvLib.Models;
using InvLib.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvLib.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly BookService _bookService;

        public BooksController(ApplicationDbContext context, IMapper mapper, BookService bookService)
        {
            _context = context;
            _mapper = mapper;
            _bookService = bookService;
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet]
        [ProducesResponseType(typeof(List<BookDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllBooks(
                string? titleStartLetter = null,
                string? authorStartLetter = null,
                bool? availability = null,
                string sortOrder = "asc",
                string? titleSearch = null
        )
        {
            var booksQuery = _bookService.BuildBooksQuery(
                titleStartLetter, authorStartLetter, availability, sortOrder, titleSearch);

            var books = await booksQuery.ToListAsync();
            var booksDtos = _mapper.Map<List<BookDto>>(books);
            return Ok(booksDtos);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet("featured")]
        [ProducesResponseType(typeof(List<BookDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFeaturedBooks(
                string? titleStartLetter = null,
                string? authorStartLetter = null,
                bool? availability = null,
                string sortOrder = "asc",
                string? titleSearch = null,
                int count = 20
        )
        {
            var booksQuery = _bookService.BuildBooksQuery(
                 titleStartLetter, authorStartLetter, availability, sortOrder, titleSearch);

            //Randomise selection of books
            var random = new Random();
            var booksList = await booksQuery.ToListAsync();
            var featuredBooks = booksList.OrderBy(_ => random.Next()).Take(count).ToList();
            var booksDtos = _mapper.Map<List<BookDto>>(featuredBooks);
            return Ok(booksDtos);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<BookDto>(book));
        }

        [Authorize(Policy = "LibraryManager")]
        [HttpPost]
        [ProducesResponseType(typeof(BookDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateBook([FromBody] BookDto bookData)
        {
            var book = _mapper.Map<Book>(bookData);
            var createdBook = await _context.Books.AddAsync(book);
            var result =  await _context.SaveChangesAsync();
            
            if (result == 0)
                return StatusCode(500);

            return CreatedAtAction(nameof(book), new { id = book.Id }, bookData);
        }

        [Authorize(Policy = "LibraryManager")]
        [HttpPost("{id}")]
        [ProducesResponseType(typeof(BookDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookDto bookData)
        {
            var existingBook = await _context.Books.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }
            _mapper.Map(bookData, existingBook);

            var result = await _context.SaveChangesAsync();
            var updatedBookDto = _mapper.Map<BookDto>(existingBook);
            if (result > 0)
                return Ok(updatedBookDto);

            return StatusCode(500, "Failed to update the book.");
        }

        [Authorize(Policy = "LibraryManager")]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound("The Book to delete doesn't exist.");
            _context.Books.Remove(book);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return Ok();

            return StatusCode(500, "Failed to delete book.");
        }

    }
}
