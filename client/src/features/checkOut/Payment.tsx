// import { useFormContext } from "react-hook-form";
import AppTextInput from "../../components/AppTextInput";
import { PaymentElement } from "@stripe/react-stripe-js";

const Payment = () => {
  return (
    <div className="mx-auto w-full text-primary">
      <h2 className="mb-4 font-bold md:text-xl text-heading ">Payment</h2>
      <label className="mt-8  leading-4 text-base-content ">Name on card</label>
      <div className="mt-2 flex-col">
        <div>
          <AppTextInput className="border rounded border-gray-300 p-4 w-full  leading-4" name="nameOnCard" label="Name on card" />
        </div>
      </div>
      <label className="mt-8  text-base-content leading-4 ">Card details</label>
      <div className="mt-2 flex flex-col gap-2">
        <PaymentElement />
      </div>
    </div>
  );
};
export default Payment;
