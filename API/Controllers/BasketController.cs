using API.Data;
using API.DTOs;
using API.Entity;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class BasketController(StoreContext context) : BaseApiController
{
    private readonly StoreContext _context = context;

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        Basket? basket = await RetrieveBasket(getBuyerId());
        basket ??= CreateBasket();

        return basket.MapBasketToDto();
    }



    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        Basket? basket = await RetrieveBasket(getBuyerId());
        basket ??= CreateBasket();

        var product = await _context.Products.FindAsync(productId);

        if (product == null) return NotFound();

        basket.AddItem(product, quantity);

        var res = await _context.SaveChangesAsync() > 0;

        if (res) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

        return BadRequest(new ProblemDetails { Title = "Problem Saving Item to Basket" });
    }


    [HttpDelete]
    public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
    {
        Basket? basket = await RetrieveBasket(getBuyerId());
        if (basket == null) return NotFound();

        basket.RemoveItem(productId, quantity);

        var res = await _context.SaveChangesAsync() > 0;

        if (res) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem removing ite," });

    }



    private async Task<Basket?> RetrieveBasket(string buyerId)
    {

        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }

        return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(i => i.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }


    private string? getBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }

    private Basket CreateBasket()
    {
        var BuyerId = User.Identity?.Name;
        if (string.IsNullOrEmpty(BuyerId))
        {
            BuyerId = Guid.NewGuid().ToString();
            var cookieOption = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };

            Response.Cookies.Append("buyerId", BuyerId, cookieOption);

        }


        var basket = new Basket { BuyerId = BuyerId };
        _context.Baskets.Add(basket);
        return basket;
    }




}