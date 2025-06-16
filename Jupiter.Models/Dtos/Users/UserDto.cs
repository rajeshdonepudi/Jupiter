using Jupiter.Models.Entities.Users;

namespace Jupiter.Models.Dtos.Users
{
    public class UserProfileInfoDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string Phone { get; set; }

        public UserProfileInfoDto(User user)
        {
            FirstName = user.FirstName;

            LastName = user.LastName;

            FullName = user.FirstName + " " + user.LastName;

            Email = user?.Email ?? "";

            Avatar = user?.ProfilePicture?.Base64 ?? "";

            Phone = user?.PhoneNumber!;
        }
    }


    public class UserDto
    {
        public UserDto()
        {

        }

        public UserDto(User user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Avatar = user?.ProfilePicture?.Base64 ?? "";
            FullName = user?.FirstName + " " + user?.LastName;
            UserName = user?.UserName!;
            Email = user?.Email!;
            Phone = user?.PhoneNumber!;
            EmailConfirmed = user.EmailConfirmed;
            PhoneNumberConfirmed = user.PhoneNumberConfirmed;
            TwoFactorEnabled = user.TwoFactorEnabled;
            LockoutEnabled = user.LockoutEnabled;
            CreatedOn = user.CreatedOn;
        }

        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public string FullName { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool LockoutEnabled { get; set; }
        public string Password { get; set; }
        public string Avatar { get; set; }
        public string ConfirmPassword { get; set; }
        public DateTime CreatedOn { get; set; }
        public string LockoutProbability { get; set; }
    }
}
