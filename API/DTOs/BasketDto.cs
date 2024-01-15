using API.Entity;

namespace API.DTOs;
public class BasketDto
{
    public int Id { get; set; }
    public required string BuyerId { get; set; }

    public required long BasketItemsTotal { get; set; }
    public required long BasketTaxes { get; set; }
    public required long BasketShipping { get; set; }
    public required long BasketTotal { get; set; }
    public required List<BasketItemDto> Items { get; set; }

}