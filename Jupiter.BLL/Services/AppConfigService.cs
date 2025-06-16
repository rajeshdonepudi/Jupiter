using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class AppConfigService : IAppConfigService
    {
        private readonly IConfiguration _configuration;

        public AppConfigService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Get value of the key accepts section name with key or only key ex. {Section:Key | key}
        /// </summary>
        /// <param name="key"></param>
        /// <returns>string</returns>
        public async Task<string> GetValueAsync(string key)
        {
            var val = _configuration[key];

            if (string.IsNullOrEmpty(val))
            {
                throw new Exception(MessageHelper.GeneralErrors.SOMETHING_WENT_WRONG);
            }

            return await Task.FromResult(val);
        }
    }
}
