using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Jupiter.API.Providers
{
    public class CustomUserIdentifierProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            // Use the email claim or any other claim you use as the identifier
            return connection.User?.FindFirst(ClaimTypes.Actor)?.Value!;
        }
    }
}
