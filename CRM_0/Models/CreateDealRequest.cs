namespace CRM_0.Models
{
    public class CreateDealRequest
    {
        public string Title { get; set; } = string.Empty;

        public decimal ExpectedAmount { get; set; }

        public string Stage { get; set; } = string.Empty;
    }
}
