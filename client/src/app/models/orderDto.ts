import { BasketItem } from "./basket";

export interface orderDto {
  id: number;
  buyerId: number;
  shippingAddress: ShippingAddress;
  orderDate: string;
  orderItems: BasketItem[];
  subtotal: number;
  deliveryFee: number;
  orderStatus: string;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
