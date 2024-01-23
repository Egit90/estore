import BasketSummary from "./BasketSummary";
import BasketItems from "./BasketItems";
import { useAppSelector } from "../../app/store/configureStore";

const BasketPage = () => {
  const { basket } = useAppSelector((s) => s.basket);

  if (!basket)
    return (
      <div className=" flex justify-center items-center fixed top-20 right-0 bottom-0 left-0">
        <h1> basket Is Empty </h1>
      </div>
    );

  return (
    <div className="h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl mb-4">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <div className="bg-base-300 rounded-lg shadow-md p-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Product</th>
                    <th className="text-left font-semibold">Price</th>
                    <th className="text-left font-semibold">Quantity</th>
                    <th className="text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* product */}
                  {basket && basket.items.map((e, i) => <BasketItems key={i} item={e} />)}
                </tbody>
              </table>
            </div>
          </div>
          {basket && <BasketSummary basket={basket} />}
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
