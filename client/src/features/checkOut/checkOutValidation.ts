import * as yup from "yup";

export const validationSchema = [
  yup.object(),
  yup.object({
    fullName: yup.string().required("full name is required"),
    address1: yup.string().required("address is required"),
    address2: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    country: yup.string().required(),
    saveAddress: yup.boolean(),
  }),
  yup.object({
    nameOnCard: yup.string().required(),
  }),
  yup.object(),
];

export type checkOutModel = {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  saveAddress: boolean;
  nameOnCard: string;
};
