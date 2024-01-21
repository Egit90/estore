using API.DTOs;
using API.Entity;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class AccountController(UserManager<User> userManager, TokenService tokenService) : BaseApiController
{
    private readonly UserManager<User> userManager = userManager;
    private readonly TokenService _tokenService = tokenService;

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByNameAsync(loginDto.UserName);

        if (user == null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }
        return new UserDto
        {
            Email = user.Email!,
            UserName = user.UserName!,
            Token = await _tokenService.GenerateToken(user),
        };
    }


    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };

        var res = await userManager.CreateAsync(user, registerDto.Password);

        if (!res.Succeeded)
        {
            foreach (var err in res.Errors)
            {
                ModelState.AddModelError(err.Code, err.Description);
            }
            return ValidationProblem();
        }

        await userManager.AddToRoleAsync(user, "Member");

        return StatusCode(201);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await userManager.GetUserAsync(User);

        if (user == null)
        {
            return Unauthorized();
        }

        return new UserDto
        {
            Email = user.Email!,
            UserName = user.UserName!,
            Token = await _tokenService.GenerateToken(user)
        };
    }


}