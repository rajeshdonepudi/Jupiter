using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.Helpers.Helpers
{
    public class CacheHelper
    {
        private readonly IMemoryCache _cache;
        private readonly Dictionary<string, List<string>> _cacheKeys;

        public CacheHelper(IMemoryCache cache)
        {
            _cache = cache;
            _cacheKeys = new Dictionary<string, List<string>>();
        }

        public void AddKey(string key, string cacheKey)
        {
            if (!_cacheKeys.ContainsKey(key))
            {
                _cacheKeys[key] = new List<string>();
            }
            _cacheKeys[key].Add(cacheKey);
        }

        public void InvalidateUserPermissionsCache(Guid userId, Guid tenantId)
        {
            var key = $"{userId}_{tenantId}";
            if (_cacheKeys.ContainsKey(key))
            {
                foreach (var cacheKey in _cacheKeys[key])
                {
                    _cache.Remove(cacheKey);
                }
                _cacheKeys.Remove(key);
            }
        }

        public void UpdateUserPermissionsCache(Guid userId, Guid tenantId, string permission, bool hasPermission)
        {
            var cacheKey = $"{userId}_{tenantId}_{permission}";
            _cache.Set(cacheKey, hasPermission, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
            });
            AddKey($"{userId}_{tenantId}", cacheKey);
        }
    }

}
