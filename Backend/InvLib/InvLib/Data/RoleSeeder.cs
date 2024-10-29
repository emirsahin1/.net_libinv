using Microsoft.AspNetCore.Identity;

namespace InvLib.Data
{
    public static class RoleSeeder
    {
        public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (roleManager != null)
            {
                var roles = new[] { Roles.Librarian, Roles.Customer};
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }
        }
    }
}
