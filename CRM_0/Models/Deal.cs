namespace CRM_0.Models
{
    public class Deal
    {
        public int Id { get; set; } 

        public int CustomerId { get; set; }

        public string Title { get; set; } = string.Empty;

        public decimal ExpectedAmount { get; set; }

        public string Stage { get; set; } = string.Empty; // 잠재 / 협의 / 제안 / 계약 / 실패만 사용

        public DateTime CreatedAt { get; set; }

        public Customer Customer { get; set; } = null!;
    }
}
