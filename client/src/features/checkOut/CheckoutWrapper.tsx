import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Checkout";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useCreatePaymentIntentMutation } from "../../app/api/paymentApi";
import { useEffect, useState } from "react";
import Loading from "../loading/Loading";
import { useAppSelector } from "../../app/store/configureStore";
const stripePromise = loadStripe("pk_test_51OfryIJgnv6mhJvlQcJ94s9MF7JBDct1iyqMErR9QNS4qgIlWTTkjTSb9jLvpnNax2cP1W055xONDCD8ZTscffEO007Oz0c9zM");

const CheckoutWrapper = () => {
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();
  const [options, setOptions] = useState<StripeElementsOptions>({});

  const { basket } = useAppSelector((s) => s.basket);
  const { isDark } = useAppSelector((s) => s.theme);

  useEffect(() => {
    const getPaymentIntent = async () => {
      await createPaymentIntent();
      setOptions({
        clientSecret: basket?.clientSecret,
        appearance: {
          theme: isDark ? "night" : "stripe",
        },
      });
    };
    getPaymentIntent();
  }, [createPaymentIntent, isDark, basket?.clientSecret]);

  if (isLoading) return <Loading />;

  return (
    <Elements stripe={stripePromise} options={options}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;
