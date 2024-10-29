using AutoMapper;
using InvLib.Data;
using InvLib.Dtos.Review;
using InvLib.Exceptions;
using InvLib.Models;
using Microsoft.EntityFrameworkCore;

namespace InvLib.Services
{
    public class ReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReviewService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Normally, I would not use exceptions for this type of thing
        //using exceptions for times sake.
        /// <returns>A <see cref="ReviewDto"/> containing the created review details.</returns>
        /// <exception cref="ServiceExceptions.ValidationException">Thrown when the review request is invalid.</exception>
        /// <exception cref="ServiceExceptions.ServerErrorException">Thrown when an unexpected error occurs during the review creation process.</exception>
        /// <exception cref="ServiceExceptions.NotFoundException">Thrown when an entity cannot be found in the database.</exception>
        public async Task<ReviewDto> CreateReview(ReviewCreationDto reviewData, string UserId)
        {
            if (reviewData == null)
                throw new ServiceExceptions.ValidationException("Review request cannot be empty.");

            var book = await _context.Books.FindAsync(reviewData.BookId);
            if (book == null)
                throw new ServiceExceptions.NotFoundException("The book being reviewed was not found.");

            var user = await _context.Users.FindAsync(UserId);
            if (user == null)
                throw new ServiceExceptions.NotFoundException("The user reviewing was not found.");

            var review = _mapper.Map<Review>(reviewData);
            await _context.Reviews.AddAsync(review);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
                throw new ServiceExceptions.ServerErrorException("Failed to create review.");

            var resultRatingUpdate = await UpdateBookAvgRating(book.Id);
            if (!resultRatingUpdate)
                throw new ServiceExceptions.ServerErrorException("Failed to update book avg rating.");

            var reviewResponse = _mapper.Map<ReviewDto>(review);
            return reviewResponse;
        }

        public async Task<bool> UpdateBookAvgRating(int bookId)
        {
            var book = await _context.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == bookId);
            if (book == null)
                return false;

            //Calculate Avg of ratings
            var reviews = book.Reviews;
            double sum = 0;
            foreach (var review in reviews){sum += review.Rating;}
            double avgRating = sum / reviews.Count;

            book.AverageRating = avgRating;
            _context.SaveChanges();
            return true;
        }

    }
}
