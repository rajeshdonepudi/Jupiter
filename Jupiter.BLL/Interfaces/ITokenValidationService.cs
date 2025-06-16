using System.Security.Claims;

namespace Jupiter.BLL.Interfaces
{
    public interface ITokenValidationService
    {
        IDictionary<string, string>? GetAllClaims(string token, Guid tenantId);
        ClaimsPrincipal? ValidateToken(string token, Guid tenantId);
    }
}