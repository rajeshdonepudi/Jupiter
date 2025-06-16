using IdenticonSharp.Identicons;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Leads;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class LeadService : BaseService, ILeadService
    {
        public LeadService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantProvider, IIdenticonProvider identiconProvider) :
            base(userManager, unitOfWork, httpContextAccessor, configuration, tenantProvider, identiconProvider)
        {
        }

        public async Task<PagedList<LeadDto>> GetAllLeads(PageParams pageParams, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.LeadRepository.GetAllLeads(pageParams, TenantId, cancellationToken);

            return result;
        }

        public async Task<LeadDto> GetLead()
        {
            return new LeadDto();
        }
    }
}
