using API.Data;
using API.DTOs;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class BasketController(StoreContext context) : BaseApiController
{
    private readonly StoreContext _context = context;

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        Basket? basket = await RetrieveBasket();
        basket ??= CreateBasket();

        return MapBasketToDto(basket);
    }



    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        Basket? basket = await RetrieveBasket();
        basket ??= CreateBasket();

        var product = await _context.Products.FindAsync(productId);

        if (product == null) return NotFound();

        basket.AddItem(product, quantity);

        var res = await _context.SaveChangesAsync() > 0;

        if (res) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

        return BadRequest(new ProblemDetails { Title = "Problem Saving Item to Basket" });
    }


    [HttpDelete]
    public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
    {
        return BadRequest("testing error");
        Basket? basket = await RetrieveBasket();
        if (basket == null) return NotFound();

        basket.RemoveItem(productId, quantity);

        var res = await _context.SaveChangesAsync() > 0;

        if (res) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem removing ite," });

    }



    private async Task<Basket?> RetrieveBasket()
    {
        var buyerID = Request.Cookies["buyerId"];
        if (buyerID == null) return null;

        return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(i => i.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerID);
    }
    private Basket CreateBasket()
    {
        var BuyerId = Guid.NewGuid().ToString();
        var cookieOption = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.Now.AddDays(30)
        };

        Response.Cookies.Append("buyerId", BuyerId, cookieOption);

        var basket = new Basket { BuyerId = BuyerId };
        _context.Baskets.Add(basket);
        return basket;
    }

    private BasketDto MapBasketToDto(Basket basket)
    {

        var BasketItemsTotal = (long)basket.Items.Aggregate(0.0, (acc, current) =>
        {
            var total = current.Product.Price * current.Quantity;
            return acc + total;
        });

        var Tax = (long)(BasketItemsTotal * 0.07);

        var shippping = 0;

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
            BasketShipping = shippping,
            BasketTotal = BasketItemsTotal + Tax + shippping
        };
    }


}