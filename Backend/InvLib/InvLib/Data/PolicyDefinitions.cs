using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace InvLib.Data
{
    public class PolicyDefinitions
    {
        public static void AddAuthorizationPolicies(AuthorizationOptions options)
        {
            options.AddPolicy("ViewDataPolicy", policy => policy.RequireRole("Librarian", "Customer"));
            options.AddPolicy("LibraryManager", policy => policy.RequireRole("Librarian"));
        }
    }
}
