using Jupiter.Helpers.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.Extensions.EntityFramework
{
    public static class QueryableExtensions
    {
        public async static Task<PagedList<T>> ToPagedListAsync<T>(this IQueryable<T> query, PageParams model, CancellationToken? cancellationToken)
        {
            var totalItems = await query.CountAsync(cancellationToken.GetValueOrDefault());
            var items = await query.Skip(model.Page * model.PageSize)
                                   .Take(model.PageSize)
                                   .ToListAsync(cancellationToken.GetValueOrDefault());

            return new PagedList<T>(items, model, totalItems);
        }
    }
}
