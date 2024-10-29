using AutoMapper;
using InvLib.Data;
using InvLib.Dtos.Review;
using InvLib.Exceptions;
using InvLib.Models;
using InvLib.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvLib.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ReviewService _reviewService;
        private readonly UserManager<User> _userManager;

        public ReviewsController(ApplicationDbContext context, IMapper mapper, 
            ReviewService reviewService, UserManager<User> userManager)
        {
            _context = context;
            _mapper = mapper;
            _reviewService = reviewService;
            _userManager = userManager;
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet]
        [ProducesResponseType(typeof(List<ReviewDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews.ToListAsync();
            var reviewDtos = _mapper.Map<List<ReviewDto>>(reviews);
            return Ok(reviewDtos);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound("Review not found.");
            }
            return Ok(_mapper.Map<ReviewDto>(review));
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet("book/{book_id}")]
        [ProducesResponseType(typeof(List<ReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReviewsByBook(int book_id)
        {
            var book = await _context.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == book_id);
            if (book == null)
            {
                return NotFound("Review not found.");
            }
            return Ok(_mapper.Map<List<ReviewDto>>(book.Reviews));
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpPost]
        [ProducesResponseType(typeof(List<ReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreationDto reviewDto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var userId = user?.Id;
                var reviewResponseDto = await _reviewService.CreateReview(reviewDto, userId);
                return CreatedAtAction(nameof(CreateReview), new { id = reviewResponseDto.Id }, reviewResponseDto);
            }
            catch (ServiceExceptions.ServerErrorException ex)
            {
                return StatusCode(500, ex.Message);
            }
            catch (ServiceExceptions.ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewDto reviewData)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            _mapper.Map(reviewData, review);
            await _context.SaveChangesAsync();

            var updatedReviewDto = _mapper.Map<ReviewDto>(review);
            await _reviewService.UpdateBookAvgRating(review.BookId);

            return Ok(updatedReviewDto);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound("Review not found.");
            }
            var bookId = review.BookId;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            var updatedReviewDto = _mapper.Map<ReviewDto>(review);
            await _reviewService.UpdateBookAvgRating(bookId);

            return Ok("Review deleted successfully.");
        }

    }
}
