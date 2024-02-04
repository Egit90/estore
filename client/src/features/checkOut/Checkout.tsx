import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/store/configureStore";
import BasketItems from "../basket/BasketItems";
import BasketSummary from "../basket/BasketSummary";
import ShippingInformation from "./ShippingInformation";
import Payment from "./Payment";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkOutValidation";
import { useCreateOrderMutation } from "../../app/api/ordersApi";
import { useDispatch } from "react-redux";
import { basketApi } from "../../app/api/basketApi";
import { useGetAddressQuery } from "../../app/services/auth";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { basket } = useAppSelector((s) => s.basket);
  const [step, setStep] = useState(1);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [declinedMessage, setDeclinedMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { data: shippingAddressSavedInDb } = useGetAddressQuery();

  const isPrimary = (a: number) => {
    const b = a <= step ? "step-primary" : "";
    return b;
  };

  const stepper = () => {
    switch (step) {
      case 1:
        return <ShippingInformation />;
      case 2:
        return <Payment />;
    }
  };

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema[step]),
  });

  const addOrRemoveStep = (a: number) => {
    if (a > 1 && step === 1 && !methods.formState.isValid) return;
    if (a > 2 && step === 2 && !methods.formState.isValid) return;
    if (step === 3) return;
    setStep(a);
  };

  const handleNext = async (data: FieldValues) => {
    if (step < 2) {
      setStep((e) => e + 1);
      return;
    }

    // event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setPaymentLoading(false);
    if (error) {
      // declined
      setDeclinedMessage(error.message!);
    } else if (paymentIntent && paymentIntent?.status === "succeeded") {
      const { saveAddress, address1, address2, city, country, fullName, state, zip } = data;

      const res = await createOrder({
        saveAddress: saveAddress,
        shippingAddress: {
          address1,
          address2,
          city,
          country,
          fullName,
          state,
          zip,
        },
      });
      if ("data" in res) {
        dispatch(basketApi.util.invalidateTags(["Basket"]));
        navigate("/confirmation", { state: { data: res.data } });
      }
    }
  };

  useEffect(() => {
    if (shippingAddressSavedInDb) {
      methods.reset({ ...methods.getValues(), ...shippingAddressSavedInDb, saveAddress: false });
    }
  }, [methods, shippingAddressSavedInDb]);

  if (step < 3 && basket?.basketItemsTotal === 0) return <p>Basket Is Empty</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleNext)} className="justify-center w-full mx-auto">
        <div className="gradient-bg rounded-md p-1 ">
          <div className="flex flex-col justify-center w-full bg-base-300 rounded-lg p-8 ">
            <ul className="steps">
              <li onClick={() => addOrRemoveStep(1)} className={`step  transition duration-200 ease-in-out ${isPrimary(1)}`}>
                Register
              </li>
              <li onClick={() => addOrRemoveStep(2)} className={`step  transition duration-200 ease-in-out ${isPrimary(2)}`}>
                Payment
              </li>
            </ul>
            <div className="mx-auto w-full">
              <div className="flex flex-col w-full px-0 mx-auto lg:flex-row">
                <div className="flex flex-col md:w-full  bg-base-300 rounded-lg p-8">
                  {stepper()}
                  {declinedMessage.length > 0 && <p className="font-bold text-red-400"> {declinedMessage}</p>}
                  {/* Submit */}
                  {step <= 2 && (
                    <div className="mt-4">
                      <button className="w-full px-6 py-2 btn btn-primary" type="submit" disabled={!methods.formState.isValid || paymentLoading}>
                        {step === 2 ? "Pay" : "Next"}
                        {(isLoading || paymentLoading) && <span className="loading loading-spinner loading-xs absolute top-1/2 -translate-y-1/2 right-4"></span>}
                      </button>
                    </div>
                  )}
                </div>
                {/* Order Summary */}
                {step < 3 && (
                  <div className="flex flex-col w-full ml-0 lg:ml-12 lg:w-2/5  bg-base-300 rounded-lg p-8 ">
                    <div className="overflow-y-scroll max-h-[40vh]">
                      <table className="w-full">
                        <tbody>{basket && basket.items.map((e, i) => <BasketItems showOnly={true} key={i} item={e} />)}</tbody>
                      </table>
                    </div>
                    <div className="h-4"></div>
                    <hr />
                    {basket && <BasketSummary showOnly={true} basket={basket} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Checkout;
