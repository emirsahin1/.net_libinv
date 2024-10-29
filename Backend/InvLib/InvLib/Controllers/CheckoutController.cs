using AutoMapper;
using InvLib.Data;
using InvLib.Dtos.Book;
using InvLib.Dtos.Checkout;
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
    public class CheckoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly CheckoutService _checkoutService;
        private readonly UserManager<User> _userManager;


        public CheckoutController(ApplicationDbContext context, IMapper mapper, 
            CheckoutService checkoutService, UserManager<User> userManager)
        {
            _context = context;
            _mapper = mapper;
            _checkoutService = checkoutService;
            _userManager = userManager;
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet]
        [ProducesResponseType(typeof(List<CheckoutResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCheckouts()
        {
            var checkouts = await _context.Books.ToListAsync();
            var checkoutsDtos = _mapper.Map<List<CheckoutResponseDto>>(checkouts);
            return Ok(checkoutsDtos);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CheckoutResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCheckoutById(int id)
        {
            var checkout = await _context.Checkouts.FindAsync(id);
            if (checkout == null)
            {
                return NotFound();
            }
            var checkoutDto = _mapper.Map<CheckoutResponseDto>(checkout);
            return Ok(checkoutDto);
        }

        [Authorize(Policy = "ViewDataPolicy")]
        [HttpPost]
        [ProducesResponseType(typeof(CheckoutResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCheckout([FromBody] CheckoutCreationDto checkoutDto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var userId = user?.Id;
                var checkoutResponseDto = await _checkoutService.CreateCheckout(checkoutDto, userId);
                return CreatedAtAction(nameof(CreateCheckout), new {id = checkoutResponseDto.Id}, checkoutResponseDto);
            }
            catch (ServiceExceptions.ServerErrorException ex)
            {
                return StatusCode(500, ex.Message);
            }
            catch(ServiceExceptions.ValidationException ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "LibraryManager")]
        [HttpPost("{id}")]
        [ProducesResponseType(typeof(CheckoutResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCheckout(int id, [FromBody] CheckoutUpdateDto checkoutDto)
        {
            var existingCheckout = await _context.Checkouts.FindAsync(id);
            if (existingCheckout == null)
            {
                return NotFound("Checkout not found.");
            }
            _mapper.Map(checkoutDto, existingCheckout);

            var result = await _context.SaveChangesAsync();
            var updatedCheckoutDto = _mapper.Map<BookDto>(existingCheckout);
            if (result > 0)
                return Ok(updatedCheckoutDto);

            return StatusCode(500, "Failed to update the checkout item.");
        }

        [Authorize(Policy = "LibraryManager")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(CheckoutResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCheckout(int id)
        {
            var checkout = await _context.Books.FindAsync(id);
            if (checkout == null)
                return NotFound("The Checkout item to delete doesn't exist.");
            _context.Books.Remove(checkout);

            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return Ok();

            return StatusCode(500, "Failed to delete Checkout item.");
        }
    }
}
