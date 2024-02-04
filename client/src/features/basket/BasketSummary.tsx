import { Link } from "react-router-dom";
import { Basket } from "../../app/models/basket";
import { currencyFormat } from "../../app/util/util";

const BasketSummary = ({ basket, showOnly = false }: { basket: Basket; showOnly?: boolean }) => {
  if (!basket) return null;
  return (
    <div className={`${showOnly ? "w-full" : "md:w-1/4"}`}>
      <div className="bg-base-300 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{currencyFormat(basket.basketItemsTotal)} </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Taxes</span>
          <span>{currencyFormat(basket.basketTaxes)} </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{basket.basketShipping === 0 ? "free" : `${currencyFormat(basket.basketShipping)}`}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{currencyFormat(basket.basketTotal)}</span>
        </div>
        {!showOnly && (
          <Link to={"/checkout"} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">
            Checkout
          </Link>
        )}
      </div>
    </div>
  );
};

export default BasketSummary;
