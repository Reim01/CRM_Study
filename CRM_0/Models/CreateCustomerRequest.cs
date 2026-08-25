namespace CRM_0.Models
{
    public record CreateCustomerRequest (

        string Name,
        string Company,
        string Email,
        string Status
    );
}
