using Microsoft.AspNetCore.Identity;

namespace API.Entity;
public class User : IdentityUser<int>
{
    public UserAddress? Address { get; set; }
}