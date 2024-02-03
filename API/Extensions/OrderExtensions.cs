using API.Entity.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;
public static class OrderExtensions
{
    public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
    {
        return query
                .Select(x => new OrderDto
                {
                    Id = x.Id,
                    BuyerId = x.BuyerId,

                    ShippingAddress = x.ShippingAddress,
                    OrderDate = x.OrderDate,
                    Subtotal = x.Subtotal,
                    DeliveryFee = x.DeliveryFee,
                    OrderStatus = x.OrderStatus.ToString(),
                    total = x.GetTotal(),
                    OrderItems = x.OrderItems.Select(item => new OrderItemDto
                    {
                        Name = item.ItemOrdered.Name,
                        PictureUrl = item.ItemOrdered.PictureUrl,
                        Price = item.Price,
                        ProductId = item.Id,
                        Quantity = item.Quantity
                    }).ToList(),
                }).AsNoTracking();
    }

}