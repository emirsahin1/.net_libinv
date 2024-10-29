using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public required string Title { get; set; }

        public int Rating { get; set; }
  
        public required string Description { get; set; }
    }
}
