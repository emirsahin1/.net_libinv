using InvLib.Data;
using InvLib.Dtos.User;
using InvLib.Models;
using InvLib.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace InvLib.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly RoleService _roleService;

        public UserController(UserManager<User> userManager, 
            SignInManager<User> signInManager,
            RoleManager<IdentityRole> roleManager,
            RoleService roleService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _roleService = roleService;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(UserInfoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationData)
        {
            if (registrationData == null)
                return BadRequest("Invalid Registration Data");
           
            var user = new User
            {
                FullName = registrationData.FullName,
                Email = registrationData.Email,
                UserName = registrationData.Email
            };

            var creationResult = await _userManager.CreateAsync(user, registrationData.Password);
            if (!creationResult.Succeeded)
                return BadRequest(creationResult.Errors);
            else
            {
                //Assign the correct Role to the User
                ServiceResponse roleResult;
                string role;
                if (registrationData.IsLibrarian)
                    role = Roles.Librarian;
                else
                    role = Roles.Customer;

                roleResult = await _roleService.AssignRoleToUserAsync(user, role);
                if (roleResult.Succeeded)
                    return Ok(new UserInfoDto { UserId = user.Id,
                                                Email = user.Email, 
                                                FullName = user.FullName,
                                                Roles = new List<string> { role }});
                else
                    return StatusCode(500, roleResult.Message);
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(UserInfoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginData)
        {
            if (loginData == null)
            {
                return BadRequest("Invalid Login Data");
            }

            var result = await _signInManager.PasswordSignInAsync(
                loginData.Email, 
                loginData.Password, 
                isPersistent: false, 
                lockoutOnFailure: false
            );

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginData.Email);
                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new UserInfoDto
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Roles = roles
                });
            }
            return Unauthorized("Invalid Login Credentials");
        }

        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "User has been logged out" });
        }

        [HttpGet("me")]
        [ProducesResponseType(typeof(UserInfoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User is not authenticated");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var userInfo = new UserInfoDto
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Roles = roles
            };

            return Ok(userInfo);
        }

    }
}
