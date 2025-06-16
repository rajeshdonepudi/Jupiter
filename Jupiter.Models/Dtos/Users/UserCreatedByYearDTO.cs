namespace Jupiter.Models.Dtos.Users
{
    public record UserCreatedByYearDTO
    {
        public long Year { get; set; }
        public long TotalUsers { get; set; }
    }
}
