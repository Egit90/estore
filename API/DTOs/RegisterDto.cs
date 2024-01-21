namespace API.DTOs;
public class RegisterDto : LoginDto
{
    public required string Email { get; set; }
}