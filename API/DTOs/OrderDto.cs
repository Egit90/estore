using System.ComponentModel.DataAnnotations;
using API.Entity.OrderAggregate;

namespace API;

public class OrderDto
{
    public int Id { get; set; }
    public required string BuyerId { get; set; }

    public required ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; }
    public required List<OrderItemDto> OrderItems { get; set; }
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public required string OrderStatus { get; set; }
    public long total { get; set; }


}
