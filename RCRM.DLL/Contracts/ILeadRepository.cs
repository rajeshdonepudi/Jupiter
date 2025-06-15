using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Leads;
using Jupiter.Models.Entities.Leads;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface ILeadRepository : IGenericRepository<Lead>
    {
        Task<PagedList<LeadDto>> GetAllLeads(PageParams model, Guid tenantId, CancellationToken cancellationToken);
    }
}
