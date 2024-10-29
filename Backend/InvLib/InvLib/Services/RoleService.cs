using InvLib.Data;
using InvLib.Models;
using Microsoft.AspNetCore.Identity;

namespace InvLib.Services
{
    public class RoleService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<RoleService> _logger;

        public RoleService(UserManager<User> userManager, 
                RoleManager<IdentityRole> roleManager, 
                ILogger<RoleService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task<ServiceResponse> AssignRoleToUserAsync(User user, string role)
        {
            if (await _roleManager.RoleExistsAsync(role))
            {
                var result = await _userManager.AddToRoleAsync(user, role);

                if (result.Succeeded)
                    return new ServiceResponse(true);
                else
                    return new ServiceResponse(false, "Failed to add Role to user");
            }
            else
                return new ServiceResponse(false, "Failed to add Role to user. Role does not exist.");
        }
    }
}
