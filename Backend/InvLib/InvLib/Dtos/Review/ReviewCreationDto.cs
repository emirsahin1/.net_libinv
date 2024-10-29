using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.Review
{
    public class ReviewCreationDto
    {
        [Required]
        [MaxLength(250)]
        public required string Title { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }

        [Required]
        [MaxLength(1200)]
        public required string Description { get; set; }

        [Required]

        public int BookId { get; set; }
    }
}
