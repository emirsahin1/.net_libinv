using AutoMapper;
using InvLib.Data;
using InvLib.Dtos.Checkout;
using InvLib.Exceptions;
using InvLib.Models;

namespace InvLib.Services
{
    public class CheckoutService
    {

        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CheckoutService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Normally, I would not use exceptions for this type of thing
        //using exceptions for times sake.
        /// <returns>A <see cref="CheckoutResponseDto"/> containing the created checkout details.</returns>
        /// <exception cref="ServiceExceptions.ValidationException">Thrown when the checkout request is invalid.</exception>
        /// <exception cref="ServiceExceptions.ServerErrorException">Thrown when an unexpected error occurs during the checkout creation process.</exception>
        /// <exception cref="ServiceExceptions.NotFoundException">Thrown when an entity cannot be found in the database.</exception>
        public async Task<CheckoutResponseDto> CreateCheckout(CheckoutCreationDto checkoutData, string userId)
        {
            if (checkoutData == null)
                throw new ServiceExceptions.ValidationException("Checkout request cannot be empty.");
            
            var book = await _context.Books.FindAsync(checkoutData.BookId);
            if (book == null)
                throw new ServiceExceptions.NotFoundException("The book being checked out was not found.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new ServiceExceptions.NotFoundException("The user checking out was not found.");

            if (book.IsAvailable == false)
                throw new ServiceExceptions.ServerErrorException("The book is already checked out");

            var checkout = _mapper.Map<Checkout>(checkoutData);
            checkout.UserId = userId;
            book.IsAvailable = false;
            //Set the Due date to 5 days later
            checkout.CheckoutDate = DateTime.Now;
            checkout.DueDate = checkout.CheckoutDate.AddDays(5);

            await _context.Checkouts.AddAsync(checkout);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
                throw new ServiceExceptions.ServerErrorException("Failed to create checkout.");

            var checkoutResponse = _mapper.Map<CheckoutResponseDto>(checkout);
            return checkoutResponse;
        }

    }
}
