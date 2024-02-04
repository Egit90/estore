using API.Entity;
using Stripe;

namespace API.Services;
public sealed class PaymentService(IConfiguration config)
{
    private readonly IConfiguration _config = config;

    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();

        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(e => e.Quantity * e.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;
        var Tax = (long)(subtotal * 0.07);


        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var option = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee + Tax,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            };

            intent = await service.CreateAsync(option);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee + Tax,
            };

            await service.UpdateAsync(basket.PaymentIntentId, options);

        }

        return intent;
    }
}