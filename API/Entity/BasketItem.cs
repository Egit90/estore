using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity;
[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    public int ProductId { get; set; }
    public required Product Product { get; set; }
    public int BasketID { get; set; }
    public Basket Basket { get; set; } = null!;
}