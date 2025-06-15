using Jupiter.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomainController : BaseSecureController
    {
        private readonly IDomainService _domainService;

        public DomainController(IDomainService domainService)
        {
            _domainService = domainService;
        }

        [HttpGet("{domainName}/info")]
        public async Task<IActionResult> GetDomainInfo(string domainName)
        {
            var result = await _domainService.GetDomainInfoAsync(domainName);

            return Ok(result);
        }
    }
}
