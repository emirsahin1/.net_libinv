using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace InvLib.Models
{
    public class User : IdentityUser
    {
        public string? FullName {  get; set; }
    }
}
