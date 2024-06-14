using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
	.EnableTokenAcquisitionToCallDownstreamApi()
	.AddMicrosoftGraph(builder.Configuration.GetSection("Graph"))
	.AddInMemoryTokenCaches();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(options =>
		{
			options.WithOrigins("http://localhost:5173")
			.WithHeaders("Authorization").WithExposedHeaders("Authorization");
		});
Console.WriteLine(app.Environment.IsDevelopment());
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
