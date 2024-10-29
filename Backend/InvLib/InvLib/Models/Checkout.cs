using System.ComponentModel.DataAnnotations;

namespace InvLib.Models
{
    public class Checkout
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public required Book Book { get; set; }
        
        public required string UserId { get; set; }
        public required User User { get; set; }

        public DateTime CheckoutDate { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "A Due Date is required.")]
        [DataType(DataType.Date, ErrorMessage = "The Due Date must be a valid Date.")]
        public required DateTime DueDate { get; set; }

        [DataType(DataType.Date, ErrorMessage = "The Return Date must be a valid Date.")]
        public DateTime? ReturnDate { get; set; }
    }
}
