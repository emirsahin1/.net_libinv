using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.Checkout
{
    public class CheckoutResponseDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string UserId { get; set; }

        public DateTime ReturnDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CheckoutDate { get; set; }
    }
}
