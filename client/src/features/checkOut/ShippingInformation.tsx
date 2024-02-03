import { useFormContext } from "react-hook-form";
import AppTextInput from "../../components/AppTextInput";
import AppCheckBox from "../../components/AppCheckBox";

const ShippingInformation = () => {
  const { control } = useFormContext();
  return (
    <div className="text-primary">
      <h2 className="mb-4 font-bold md:text-xl text-heading">Shipping Address</h2>
      <div className="">
        <div className="space-x-0 lg:flex lg:space-x-4">
          <div className="w-full lg:w-1/2">
            <label htmlFor="firstName" className="block mb-3 text-sm font-semibold ">
              Full Name
            </label>
            <AppTextInput
              control={control}
              name="fullName"
              label="Full Name"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full">
            <label htmlFor="Address" className="block mb-3 text-sm font-semibold ">
              Address 1
            </label>
            <AppTextInput
              control={control}
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              name="address1"
              label="Address"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full">
            <label htmlFor="Address" className="block mb-3 text-sm font-semibold ">
              Address 2
            </label>
            <AppTextInput
              control={control}
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              name="address2"
              label="Address"
            />
          </div>
        </div>
        <div className="space-x-0 lg:flex lg:space-x-4">
          <div className="w-full lg:w-1/2">
            <label htmlFor="city" className="block mb-3 text-sm font-semibold ">
              City
            </label>
            <AppTextInput
              control={control}
              name="city"
              label="City"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <label htmlFor="city" className="block mb-3 text-sm font-semibold ">
              State
            </label>
            <AppTextInput
              control={control}
              name="state"
              label="state"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="w-full lg:w-1/2 ">
            <label htmlFor="postcode" className="block mb-3 text-sm font-semibold ">
              zip Code
            </label>
            <AppTextInput
              control={control}
              name="zip"
              label="Zip Cod Code"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full">
            <label htmlFor="Address" className="block mb-3 text-sm font-semibold ">
              Country
            </label>
            <AppTextInput
              control={control}
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              name="country"
              label="Country"
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <AppCheckBox control={control} label="Save this information for next time" name="saveAddress" />
        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;
