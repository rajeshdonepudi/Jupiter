using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers
{
    [Route("api/[controller]")]
    public class TestController : BaseSecureController
    {
        [HttpGet("test")]

        public async Task<IActionResult> Get()
        {
            throw new ArgumentNullException(nameof(TestController));
            return Ok("Test verification successfull.");
        }
    }
}
