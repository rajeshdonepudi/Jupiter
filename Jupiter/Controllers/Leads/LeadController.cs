using Jupiter.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.Leads
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadController : BaseSecureController
    {
        private readonly ILeadService _leadService;

        public LeadController(ILeadService leadService)
        {
            _leadService = leadService;
        }
    }
}
