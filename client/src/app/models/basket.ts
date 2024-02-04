export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItem[];
  basketTotal: number;
  basketItemsTotal: number;
  basketTaxes: number;
  basketShipping: number;
  paymentIntentId?: string;
  clientSecret?: string;
}

export interface BasketItem {
  productId: number;
  name: string;
  pictureUrl: string;
  brand: string;
  type: string;
  price: number;
  quantity: number;
}
