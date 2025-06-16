namespace Jupiter.Models.Dtos.Users
{
    public class UpdateProfilePictureDto
    {
        public Guid UserId { get; set; }
        public string Image { get; set; }
    }
}
