using API.Data;
using API.DTOs;
using API.Entity.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;
public class PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config) : BaseApiController
{
    private readonly PaymentService _paymentService = paymentService;
    private readonly StoreContext _context = context;
    private readonly IConfiguration _config = config;

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

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebHook()
    {



        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();


        if (string.IsNullOrEmpty(json)) return NotFound();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"], _config["StripeSettings:WhSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if (order == null) return NotFound();

            // Handle the event
            if (charge.Status == "succeeded")
            {
                order.OrderStatus = OrderStatus.PaymentReceived;
                await _context.SaveChangesAsync();
                return new EmptyResult();
            }
            else
            {
                Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest();
        }
    }
}
