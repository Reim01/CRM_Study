namespace CRM_0.Models
{
    public class CustomerActivity
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }

        public string Type { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime OccurredAt { get; set; }

        public Customer Customer { get; set; } = null!;
    }
}
