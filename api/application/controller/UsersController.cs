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
            return Ok(new string[] { "Name", "Another" });
        }
    }
}
