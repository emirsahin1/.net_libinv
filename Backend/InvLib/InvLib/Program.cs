using InvLib.Data;
using InvLib.Models;
using InvLib.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization(options =>
{
    PolicyDefinitions.AddAuthorizationPolicies(options);
});

//Custom Services ----------------------
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<CheckoutService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocal", policy =>
    {
        policy.WithOrigins(
           "http://localhost",
           "http://localhost:3000",
           "http://localhost:3001",
           "http://localhost:5000",
           "http://localhost:8000",
           "http://127.0.0.1",
           "http://127.0.0.1:3000",
           "http://127.0.0.1:5000"
       )
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials(); ;
    });
});



var app = builder.Build();
//Migrate then seed the DB with Bogus data.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
    await DbSeeder.SeedBooks(dbContext);

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await RoleSeeder.SeedRoles(roleManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocal");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
