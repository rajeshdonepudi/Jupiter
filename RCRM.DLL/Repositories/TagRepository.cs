using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Leads;
using Jupiter.Models.Entities.Leads;
using Jupiter.Models.Entities.Tags;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class LeadRepository : GenericRepository<Lead>, ILeadRepository
    {
        public LeadRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public async Task<PagedList<LeadDto>> GetAllLeads(PageParams model, Guid tenantId, CancellationToken cancellationToken)
        {
            var leads = await _context.Leads.Where(x => x.TenantId == tenantId).Select(x => new LeadDto
            {
                Id = x.Id,
                Name = x.Name,
            }).ToPagedListAsync(model, cancellationToken);

            return leads;
        }
    }

    public class TagRepository : GenericRepository<Tag>, ITagRepository
    {
        public TagRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }
    }
}

