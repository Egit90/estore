namespace API.DTOs;
public class UserDto
{
    public required UserInfoDto UserInfo { get; set; }
    public BasketDto? Basket { get; set; }
}

public class UserInfoDto
{

    public required string Email { get; set; }
    public required string Token { get; set; }
    public required string UserName { get; set; }
}