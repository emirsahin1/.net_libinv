using System.ComponentModel.DataAnnotations;

namespace InvLib.Dtos.User
{
    public class UserRegistrationDto
    {
        public bool IsLibrarian { get; set; } = false;

        [Required(ErrorMessage = "Full Name is required.")]
        public string? FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
