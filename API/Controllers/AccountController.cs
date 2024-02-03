using API.Data;
using API.DTOs;
using API.Entity;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class AccountController(UserManager<User> userManager, StoreContext context, TokenService tokenService) : BaseApiController
{
    private readonly UserManager<User> userManager = userManager;
    private readonly StoreContext _context = context;
    private readonly TokenService _tokenService = tokenService;

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByNameAsync(loginDto.UserName);

        if (user == null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }

        var userBasket = await RetrieveBasket(loginDto.UserName);
        var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

        if (anonBasket != null)
        {
            if (userBasket != null) _context.Baskets.Remove(userBasket);
            anonBasket.BuyerId = user.UserName;
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }

        return new UserDto
        {
            UserInfo = new UserInfoDto
            {

                Email = user.Email!,
                UserName = user.UserName!,
                Token = await _tokenService.GenerateToken(user),
            },
            Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
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

        var userBasket = await RetrieveBasket(user.UserName);

        if (user == null)
        {
            return Unauthorized();
        }

        return new UserDto
        {
            UserInfo = new UserInfoDto
            {

                Email = user.Email!,
                UserName = user.UserName!,
                Token = await _tokenService.GenerateToken(user),
            },
            Basket = userBasket?.MapBasketToDto()
        };
    }
    private async Task<Basket?> RetrieveBasket(string buyerId)
    {

        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }

        return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(i => i.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

    [Authorize]
    [HttpGet("savedAddress")]
    public async Task<ActionResult<UserAddress>> getSavedAddress()
    {
        return await userManager.Users
                                .Where(x => x.UserName == User.Identity.Name)
                                .Select(u => u.Address)
                                .FirstOrDefaultAsync();
    }


}