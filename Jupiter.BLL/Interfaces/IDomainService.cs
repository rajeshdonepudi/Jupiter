using Jupiter.Models.Dtos.Domain;

namespace Jupiter.BLL.Interfaces
{
    public interface IDomainService
    {
        Task<DomainWhoisDto?> GetDomainInfoAsync(string domainName);
    }
}