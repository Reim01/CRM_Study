using CRM_0.Data;
using CRM_0.Models;
using Microsoft.EntityFrameworkCore;

internal class Program
{
    private static void Main(string[] args)
    {
        // 서비스/설정 준비
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("CrmDatabase");

        builder.Services.AddDbContext<CrmDbContext>(options =>
            options.UseSqlite(connectionString));

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        app.UseCors("AllowReactApp");

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<CrmDbContext>();

            db.Database.EnsureCreated();

            if (!db.Customers.Any())
            {
                db.Customers.AddRange(
                    new Customer
                    {
                        Name = "김민수",
                        Company = "에이콘 주식회사",
                        Email = "minsu@acorn.co.kr",
                        Status = "진행 중",
                    },
                    new Customer
                    {
                        Name = "이지은",
                        Company = "브릿지랩",
                        Email = "jieun@bridgelab.co.kr",
                        Status = "잠재 고객",
                    },
                    new Customer
                    {
                        Name = "박서준",
                        Company = "오로라 스튜디오",
                        Email = "seojun@aurora.co.kr",
                        Status = "계약 완료",
                    }
                );

                db.SaveChanges();
            }
        }
        
        app.MapGet("/", () => "CRM API is running.");

        app.MapGet("/api/customers", async (CrmDbContext db) =>
        {
            return await db.Customers
                .AsNoTracking()
                .OrderBy(customer => customer.Id)
                .ToListAsync();
        });

        app.MapPost("/api/customers", async (CreateCustomerRequest request, CrmDbContext db) =>
        {
            var customer = new Customer
            {
                Name = request.Name,
                Company = request.Company,
                Email = request.Email,
                Status = request.Status,
            };

            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            return Results.Created($"/api/customers/{customer.Id}", customer);
        });

        app.MapDelete("/api/customers/{id:int}", async (int id, CrmDbContext db) =>
        {
            var customer = await db.Customers.FindAsync(id);

            if(customer is null)
            {
                return Results.NotFound();
            }

            db.Customers.Remove(customer);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.Run();
    }
}