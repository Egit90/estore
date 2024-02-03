import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/store/configureStore";
import BasketItems from "../basket/BasketItems";
import BasketSummary from "../basket/BasketSummary";
import ShippingInformation from "./ShippingInformation";
import Payment from "./Payment";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkOutValidation";
import Confirmation from "./Confirmation";
import { useCreateOrderMutation } from "../../app/api/ordersApi";
import { useDispatch } from "react-redux";
import { basketApi } from "../../app/api/basketApi";
import { useGetAddressQuery } from "../../app/services/auth";

const Checkout = () => {
  const { basket } = useAppSelector((s) => s.basket);
  const [step, setStep] = useState(1);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [orderNumber, setOrderNumber] = useState(0);
  const dispatch = useDispatch();

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
      case 3:
        return <Confirmation isLoading={isLoading} orderNumber={orderNumber} />;
    }
  };

  const handleSubmit = async (data: FieldValues) => {
    if (step < 2) {
      setStep((e) => e + 1);
      return;
    }

    const { saveAddress, address1, address2, city, country, fullName, state, zip } = data;
    setStep((e) => e + 1);
    console.log(data);
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
      setOrderNumber(res.data);
      dispatch(basketApi.util.invalidateTags(["Basket"]));
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
  
  useEffect(() => {
    if (shippingAddressSavedInDb) {
      methods.reset({ ...methods.getValues(), ...shippingAddressSavedInDb, saveAddress: false });
    }
  }, [methods, shippingAddressSavedInDb]);

  if (step < 3 && basket?.basketItemsTotal === 0) return <p>Basket Is Empty</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="justify-center w-full mx-auto">
        <div className="gradient-bg rounded-md p-1 ">
          <div className="flex flex-col justify-center w-full bg-base-300 rounded-lg p-8 ">
            <ul className="steps">
              <li onClick={() => addOrRemoveStep(1)} className={`step  transition duration-200 ease-in-out ${isPrimary(1)}`}>
                Register
              </li>
              <li onClick={() => addOrRemoveStep(2)} className={`step  transition duration-200 ease-in-out ${isPrimary(2)}`}>
                Payment
              </li>
              <li onClick={() => addOrRemoveStep(3)} className={`step  transition duration-200 ease-in-out ${isPrimary(3)}`}>
                Purchase
              </li>
            </ul>
            <div className="mx-auto w-full">
              <div className="flex flex-col w-full px-0 mx-auto lg:flex-row">
                <div className="flex flex-col md:w-full  bg-base-300 rounded-lg p-8">
                  {stepper()}
                  {step < 3 && (
                    <div className="mt-4">
                      <button className="w-full px-6 py-2 btn btn-primary" type="submit" disabled={!methods.formState.isValid}>
                        {step === 2 ? "Pay" : "Next"}
                        {isLoading && <span className="loading loading-spinner loading-xs absolute top-1/2 -translate-y-1/2 right-4"></span>}
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
