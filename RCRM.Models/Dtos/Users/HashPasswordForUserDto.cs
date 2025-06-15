namespace Jupiter.Models.Dtos.Users
{
    public record HashPasswordForUserDto
    {
        public string UserId { get; set; }
        public string Password { get; set; }
    }
}
