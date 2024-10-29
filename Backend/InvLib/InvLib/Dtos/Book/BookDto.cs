using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.Book
{
    public class BookDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The title of the book is required.")]
        [MaxLength(300)]
        public required string Title { get; set; }

        [Required(ErrorMessage = "The author of the book is required.")]
        [MaxLength(300)]
        public required string Author { get; set; }
        public string? Description { get; set; }

        [Url(ErrorMessage = "The Cover Image must be a valid URL.")]
        public string? CoverImage { get; set; }

        public string? Publisher { get; set; }

        [DataType(DataType.Date, ErrorMessage = "The Publication Date must be a valid Date.")]
        public DateTime? PublicationDate { get; set; }

        public string? Category { get; set; }
        public int? PageCount { get; set; }

        [Required(ErrorMessage = "The ISBN of the book is required.")]
        [MaxLength(13)]
        public required string ISBN { get; set; }

        public double? AverageRating { get; set; }


        public bool IsAvailable { get; set; } = true;

    }
}
