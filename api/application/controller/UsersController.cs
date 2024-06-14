using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            // Implementation to get all users
            return Ok();
        }
    }
}
