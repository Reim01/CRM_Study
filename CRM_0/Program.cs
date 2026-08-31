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

            db.Database.Migrate();

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

        app.MapPut("/api/customers/{id:int}", async (int id, CreateCustomerRequest request, CrmDbContext db) =>
        {
            var customer = await db.Customers.FindAsync(id);

            if (customer is null)
            {
                return Results.NotFound();
            }

            customer.Name = request.Name;
            customer.Company = request.Company;
            customer.Email = request.Email;
            customer.Status = request.Status;

            await db.SaveChangesAsync();

            return Results.Ok(customer);
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

        app.MapGet("/api/customers/{id:int}/activities", async (int id, CrmDbContext db) =>
        {
            var customerExists = await db.Customers.AnyAsync(customer => customer.Id == id);

            if (!customerExists)
            {
                return Results.NotFound();
            }

            var activities = await db.CustomerActivities
                .AsNoTracking()
                .Where(activity => activity.CustomerId == id)
                .OrderByDescending(ACTIVITY => ACTIVITY.OccurredAt)
                .ToListAsync();

            return Results.Ok(activities);
        });

        app.MapPost("/api/customers/{id:int}/activities", async (int id, CreateCustomerActivityRequest request, CrmDbContext db) =>
        {
            var customerExists = await db.Customers.AnyAsync(customer => customer.Id == id);

            if (!customerExists)
            {
                return Results.NotFound();
            }

            var activity = new CustomerActivity
            {
                CustomerId = id,
                Type = request.Type,
                Content = request.Content,
                OccurredAt = DateTime.UtcNow,

            };

            db.CustomerActivities.Add(activity);
            await db.SaveChangesAsync();

            return Results.Created($"/api/customers/{id}/activities/{activity.Id}", activity);
        });

        app.MapGet("/api/customers/{id:int}/deals", async (int id, CrmDbContext db) =>
        {
            var customerExists = await db.Customers.AnyAsync(customer => customer.Id == id);

            if (!customerExists)
            {
                return Results.NotFound();
            }

            var deals = await db.Deals
                .AsNoTracking()
                .Where(deal => deal.CustomerId == id)
                .OrderByDescending(deal => deal.CreatedAt)
                .ToListAsync();

            return Results.Ok(deals);
        });

        app.MapPost("/api/customers/{id:int}/deals", async (int id, CreateDealRequest request, CrmDbContext db) =>
        {
            var customerExists = await db.Customers.AnyAsync(customer => customer.Id == id);

            if (!customerExists)
            {
                return Results.NotFound();
            }

            var deal = new Deal
            {
                CustomerId = id,
                Title = request.Title,
                ExpectedAmount = request.ExpectedAmount,
                Stage = request.Stage,
                CreatedAt = DateTime.UtcNow,
            };

            db.Deals.Add(deal);
            await db.SaveChangesAsync();

            return Results.Created($"/api/customers/{id}/deals/{deal.Id}", deal);
        });

        app.Run();
    }
}