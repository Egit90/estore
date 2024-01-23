using API.DTOs;
using API.Entity;

namespace API.Extensions;
public static class BasketExtensions
{
    public static BasketDto MapBasketToDto(this Basket basket)
    {
        var BasketItemsTotal = (long)basket.Items.Aggregate(0.0, (acc, current) =>
       {
           var total = current.Product.Price * current.Quantity;
           return acc + total;
       });

        var Tax = (long)(BasketItemsTotal * 0.07);

        var shipping = 0;
        return new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Brand = item.Product.Brand,
                Type = item.Product.Type,
                Price = item.Product.Price,
                Quantity = item.Quantity,
                PictureUrl = item.Product.PictureUrl
            }).ToList(),

            BasketItemsTotal = BasketItemsTotal,
            BasketTaxes = Tax,
            BasketShipping = shipping,
            BasketTotal = BasketItemsTotal + Tax + shipping
        };
    }
}