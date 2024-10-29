using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvLib.Models
{
    public class Review
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(250)]
        public required string Title {  get; set; }
        
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
        
        [Required]
        [MaxLength(1200)]
        public required string Description { get; set; }
        
        [ForeignKey("Book")]
        public int BookId { get; set; }
        public required Book Book { get; set; }

        [ForeignKey("User")]
        public string? UserId { get; set; }
        public required User User { get; set; }
    }
}
