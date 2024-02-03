using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;
public class TokenService(UserManager<User> userManager, IConfiguration config)
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IConfiguration _config = config;


    public async Task<string> GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email , user.Email!),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        };


        var roles = await _userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]!));


        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenOption = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );


        return new JwtSecurityTokenHandler().WriteToken(tokenOption);
    }


}