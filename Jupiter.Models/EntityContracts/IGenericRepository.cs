using System.Linq.Expressions;

namespace Jupiter.Models.EntityContracts
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> FindAsync(Guid id, CancellationToken cancellationToken);
        Task<T> FindAsync(Guid id, Guid tenantId, CancellationToken cancellationToken);

        Task<T> AddAsync(T entity, CancellationToken cancellationToken);
        Task<T> AddAsync(T entity, Guid tenantId, CancellationToken cancellationToken);
        Task<List<T>> AddRangeAsync(List<T> entities, CancellationToken cancellationToken);
        Task<List<T>> AddRangeAsync(List<T> entities, Guid tenantId, CancellationToken cancellationToken);

        Task<T> QueryAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken);
        Task<T> QueryAsync(Expression<Func<T, bool>> expression, Func<IQueryable<T>, IQueryable<T>> includeProperties, CancellationToken cancellationToken);


        Task<List<T>> GetAllAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken);

        void Remove(T entity);
        void RemoveRange(List<T> entities);
        void UpdateAsync(T entity);
        Task UpdateRangeAsync(List<T> entities);
    }
}
