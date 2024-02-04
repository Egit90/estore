using API.Data;
using API.DTOs;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class PaymentsController(PaymentService paymentService, StoreContext context) : BaseApiController
{
    private readonly PaymentService _paymentService = paymentService;
    private readonly StoreContext _context = context;

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        if (User?.Identity?.Name == null) return BadRequest(new ProblemDetails { Title = "User Not Found" });

        var basket = await _context.Baskets
                                   .RetrieveBasketWithItems(User.Identity.Name)
                                   .FirstOrDefaultAsync();

        if (basket == null) return NotFound();

        var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment Intent" });

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        _context.Update(basket);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating the basket with intent" });

        return basket.MapBasketToDto();

    }
}