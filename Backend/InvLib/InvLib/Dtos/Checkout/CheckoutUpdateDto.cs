using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.Checkout
{
    public class CheckoutUpdateDto
    {
        [Required]
        [DataType(DataType.Date, ErrorMessage = "The Return Date must be a valid Date.")]
        public DateTime ReturnDate { get; set; }

        [DataType(DataType.Date, ErrorMessage = "The Due Date must be a valid Date.")]
        public DateTime? DueDate { get; set; }

    }
}
