using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Graph;
using Microsoft.Identity.Web;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
.EnableTokenAcquisitionToCallDownstreamApi()
.AddMicrosoftGraph(builder.Configuration.GetSection("Graph"))
// .AddMicrosoftGraph((provider) =>
// {
// 	var scopes = new[] { "https://graph.microsoft.com/.default" };
// 	var clientId = builder.Configuration.GetValue<string>("AzureAd:ClientId");
// 	var tenantId = builder.Configuration.GetValue<string>("AzureAd:TenantId");
// 	var clientSecret = builder.Configuration.GetValue<string>("ClientSecret");
// 	// var keyVaultName = builder.Configuration.GetValue<string>("KeyVaultName");
// 	// var client = new SecretClient(new Uri($"https://{keyVaultName}.vault.azure.net"), new DefaultAzureCredential());
// 	// var clientSecret = client.GetSecret("ClientSecret")?.Value?.Value;
// 	var options = new ClientSecretCredentialOptions
// 	{
// 		AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
// 	};
// 	var clientSecretCredential = new ClientSecretCredential(
// 		tenantId, clientId, clientSecret, options);
// 	var graphClient = new GraphServiceClient(clientSecretCredential, scopes);
// 	return graphClient;
// }, [])
.AddInMemoryTokenCaches();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(options =>
		{
			options.WithOrigins("http://localhost:5173", "https://lb-webappw.azurewebsites.net")
			.WithHeaders("Authorization").WithExposedHeaders("Authorization");
		});
Console.WriteLine(app.Environment.IsDevelopment());
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();