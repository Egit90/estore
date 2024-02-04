using API.Data;
using API.DTOs;
using API.Entity;
using API.Entity.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class OrdersController(StoreContext storeContext) : BaseApiController
{
    private readonly StoreContext _context = storeContext;

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        return await _context.Orders
                    .ProjectOrderToOrderDto()
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
    }


    [HttpPost]
    public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name)
                        .FirstOrDefaultAsync();

        if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not get the  basket" });

        var items = new List<OrderItem>();

        foreach (var item in basket.Items)
        {
            var productItem = await _context.Products.FindAsync(item.ProductId);
            var itemOrder = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PictureUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrder,
                Price = productItem.Price,
                Quantity = item.Quantity
            };

            items.Add(orderItem);
            productItem.QuantityInStock -= item.Quantity;
        }

        var subtotal = items.Sum(i => i.Price * i.Quantity);

        var deliveryFee = subtotal > 1000 ? 0 : 500;

        var order = new Order
        {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            PaymentIntentId = basket.PaymentIntentId
        };

        _context.Orders.Add(order);
        _context.Baskets.Remove(basket);

        if (orderDto.SaveAddress)
        {
            var user = await _context.Users
                                .Include(x => x.Address)
                                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);



            var address = new UserAddress
            {
                FullName = orderDto.ShippingAddress.FullName,
                Address1 = orderDto.ShippingAddress.Address1,
                Address2 = orderDto.ShippingAddress.Address2,
                City = orderDto.ShippingAddress.City,
                Country = orderDto.ShippingAddress.Country,
                State = orderDto.ShippingAddress.State,
                Zip = orderDto.ShippingAddress.Zip,

            };

            user.Address = address;
        }

        var res = await _context.SaveChangesAsync() > 0;

        if (res) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

        return BadRequest("Problem Creating the Order");

    }
}