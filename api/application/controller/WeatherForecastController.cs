using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Identity.Web.Resource;

namespace api.Controllers;

//Protected Controller
[Authorize]
// Require a specific role
[RequiredScopeOrAppPermission(AcceptedAppPermission = ["565d0c1b-0263-44a5-9a6f-b80cadd337f3"])]
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    public WeatherForecastController(GraphServiceClient graphServiceClient)
    {

        _graphServiceClient = graphServiceClient;
    }
    private readonly GraphServiceClient _graphServiceClient;
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    [HttpGet]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        var scopes = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/scope")?.Value.Split(" ") ?? [];
        Console.WriteLine(scopes);
        var user = await _graphServiceClient.Me.GetAsync();
        Console.WriteLine(user?.DisplayName);
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
