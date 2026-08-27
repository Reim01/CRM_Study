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
        public DbSet<CustomerActivity> CustomerActivities => Set<CustomerActivity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CustomerActivity>()
                .HasOne(activity => activity.Customer)
                .WithMany(customer => customer.Activities)
                .HasForeignKey(activity => activity.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
