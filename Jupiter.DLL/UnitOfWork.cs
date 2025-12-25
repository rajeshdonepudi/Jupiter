using Jupiter.DAL.Contracts;
using Jupiter.DAL.Repositories;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.EntityContracts;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly JupiterContext _context;
        private readonly IMemoryCache _memoryCache;

        public UnitOfWork(JupiterContext context, IMemoryCache cache)
        {
            _context = context;
            _memoryCache = cache;

            RefreshTokenRepository = new GenericRepository<RefreshToken>(_context, _memoryCache);
            TenantRepository = new TenantRepository(_context, _memoryCache);
            UserRepository = new UserRepository(_context, _memoryCache);
            SecurityRolesRepository = new SecurityRolesRepository(_context, _memoryCache);
            AppThemeRepository = new AppThemeRepository(_context, _memoryCache);
            PermissionRepository = new PermissionRepository(_context, _memoryCache);
            SecurityGroupRepository = new SecurityGroupRepository(_context, _memoryCache);
            TenantUserSecurityGroupRepository = new TenantUserSecurityGroupRepository(_context, _memoryCache);
            TenantUserRepository = new TenantUserRepository(_context, _memoryCache);
            UserRoleRepository = new UserRoleRepository(_context, _memoryCache);
            QuestionRepository = new QuestionRepository(_context, _memoryCache);
            QuestionBankRepository = new QuestionBankRepository(_context, _memoryCache);
            TagRepository = new TagRepository(_context, _memoryCache);
            EntityTagRepository = new EntityTagRepository(_context, _memoryCache);
            ExpenseRepository = new ExpenseRepository(_context, _memoryCache);
            ExpenseCategoryRepository = new ExpenseCategoryRepository(_context, _memoryCache);
            LeadRepository = new LeadRepository(_context, _memoryCache);
        }


        public IUserRoleRepository UserRoleRepository { get; set; }
        public ILeadRepository LeadRepository { get; set; }
        public ITagRepository TagRepository { get; set; }
        public IEntityTagRepository EntityTagRepository { get; set; }
        public ISecurityGroupRepository SecurityGroupRepository { get; private set; }
        public ITenantUserRepository TenantUserRepository { get; private set; }
        public ITenantUserSecurityGroupRepository TenantUserSecurityGroupRepository { get; private set; }
        public IPermissionRepository PermissionRepository { get; private set; }
        public IGenericRepository<RefreshToken> RefreshTokenRepository { get; private set; }
        public ISecurityRolesRepository SecurityRolesRepository { get; private set; }
        public IUserRepository UserRepository { get; private set; }



        public IAppThemeRepository AppThemeRepository { get; private set; }
        public ITenantRepository TenantRepository { get; private set; }
        public IQuestionRepository QuestionRepository { get; private set; }
        public IQuestionBankRepository QuestionBankRepository { get; private set; }
        public IExpenseRepository ExpenseRepository { get; private set; }
        public IExpenseCategoryRepository ExpenseCategoryRepository { get; private set; }

        public async Task<int> SaveChangesAsync(CancellationToken token)
        {
            Console.ForegroundColor = ConsoleColor.Green;

            int added = _context.ChangeTracker.Entries()
                                              .Where(x => x.State == Microsoft.EntityFrameworkCore.EntityState.Added)
                                              .Count();

            int updated = _context.ChangeTracker.Entries()
                                                .Where(x => x.State == Microsoft.EntityFrameworkCore.EntityState.Modified)
                                                .Count();

            int deleted = _context.ChangeTracker.Entries()
                                                .Where(x => x.State == Microsoft.EntityFrameworkCore.EntityState.Detached)
                                                .Count();

            Console.WriteLine("Added: {0} Updated: {1} Deleted: {2}", added, updated, deleted);

            int res = await _context.SaveChangesAsync(token);

            Console.WriteLine("No of records updated: {0}", res);

            Console.ResetColor();

            return res;
        }

        async void IDisposable.Dispose()
        {
            await Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual async Task Dispose(bool disposing)
        {
            if (disposing)
            {
                await _context.DisposeAsync();
            }
        }
    }
}
