using Jupiter.Models.Dtos.Users;

namespace Jupiter.BLL.Interfaces
{
    public interface IUserLookupService
    {
        Task<IEnumerable<UserLookupDto>> GetAllUsersLookup(string searchTerm, CancellationToken cancellationToken);
        Task<IEnumerable<UserLookupDto>> GetAllUsersLookupByTenantId(Guid tenantId, string searchTerm, CancellationToken cancellationToken);
    }
}
