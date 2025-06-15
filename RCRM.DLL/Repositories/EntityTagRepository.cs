using Jupiter.DAL.Contracts;
using Jupiter.Models.Entities.Tags;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class EntityTagRepository : GenericRepository<EntityTag>, IEntityTagRepository
    {
        public EntityTagRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }
    }
}

