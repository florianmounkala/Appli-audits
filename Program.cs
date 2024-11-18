using NSwag.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add JWT authentication
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer = builder.Configuration["Jwt:Issuer"],
//             ValidAudience = builder.Configuration["Jwt:Issuer"],
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
//         };
//     });

// Configuration des services de logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var loggerFactory = LoggerFactory.Create(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    loggingBuilder.AddDebug();
});

var logger = loggerFactory.CreateLogger<Program>();

// Charger le fichier de configuration à partir du chemin défini par APPSETTINGS_PATH
var appSettingsPath = Environment.GetEnvironmentVariable("APPSETTINGS_PATH") ?? "appsettings.json";
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

// Log pour indiquer le chemin du fichier de configuration qui sera utilisé
logger.LogInformation("Chargement du fichier de configuration : {appSettingsPath}", appSettingsPath);
logger.LogInformation("Chargement du fichier de configuration d'environnement : appsettings.{environment}.json", environment);

builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
                     .AddJsonFile(appSettingsPath, optional: false, reloadOnChange: true)
                     .AddJsonFile($"appsettings.{environment}.json", optional: true)
                     .AddEnvironmentVariables();

builder.Services.AddControllers();

//var customAppSettingsPath = Environment.GetEnvironmentVariable("APPSETTINGS_PATH") ?? "appsettings.json";
//config.AddJsonFile(customAppSettingsPath, optional: false, reloadOnChange: true);

// DB SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SqlServerDBContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "TodoAPI";
    config.Title = "TodoAPI v1";
    config.Version = "v1";
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "TodoAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}



// Configure l'application pour utiliser l'authentification
app.UseAuthentication();

app.UseAuthorization();
app.MapControllers();
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();