using Microsoft.AspNetCore.Identity;

namespace Jupiter.API.Providers
{
    public class JupiterEmailConfirmationTokenProviderOptions : DataProtectionTokenProviderOptions
    {
        public JupiterEmailConfirmationTokenProviderOptions()
        {
            Name = "JupiterEmailConfirmationTokenProvider";
            TokenLifespan = TimeSpan.FromMinutes(15);
        }
    }
}
