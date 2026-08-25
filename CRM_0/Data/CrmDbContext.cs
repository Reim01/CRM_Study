using CRM_0.Models;
using Microsoft.EntityFrameworkCore;

namespace CRM_0.Data
{
    public class CrmDbContext : DbContext
    {
        public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options)
        {

        }

        public DbSet<Customer> Customers => Set<Customer>();
    }
}
