using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Leads;

namespace Jupiter.BLL.Interfaces
{
    public interface ILeadService
    {
        Task<PagedList<LeadDto>> GetAllLeads(PageParams pageParams, CancellationToken cancellationToken);
    }
}
