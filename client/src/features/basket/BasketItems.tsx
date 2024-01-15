import { useState } from "react";
import { BasketItem } from "../../app/models/basket";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
} from "../../app/api/agent";
import { toast } from "react-toastify";
import { currencyFormat } from "../../app/util/util";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeItem } from "./basketSlice";

const BasketItems = ({ item }: { item: BasketItem }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [deleteItem] = useDeleteItemMutation();
  const [addItem] = useCreateItemMutation();

  const handleAddItem = async (productID: number) => {
    try {
      setLoading(true);
      addItem({ productId: productID });
    } catch (error) {
      toast.error("Faild to add Item");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (producId: number, qty: number) => {
    try {
      setLoading(true);
      deleteItem({ productId: producId, qty: qty });
      dispatch(removeItem({ productId: producId, quantity: qty }));
    } catch (error) {
      toast.error("Failed to remove Item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td className="py-4">
        <div className="flex items-center">
          <Link to={`/catalog/${item.productId}`}>
            <img
              className="h-16 w-16 mr-4"
              src={item.pictureUrl}
              alt="Product image"
            />
          </Link>
          <span className="font-semibold">{item.name}</span>
        </div>
      </td>
      <td className="py-4">{currencyFormat(item.price)}</td>
      <td className="py-4">
        <div className="flex items-center">
          <button
            className="border rounded-md py-2 px-4 mr-2"
            onClick={() => handleRemoveItem(item.productId, 1)}
          >
            {loading ? (
              <span className="loading loading-ball loading-xs"></span>
            ) : (
              "-"
            )}
          </button>
          <span className="text-center w-8">{item.quantity}</span>
          <button
            className="border rounded-md py-2 px-4 ml-2"
            onClick={() => handleAddItem(item.productId)}
          >
            {loading ? (
              <span className="loading loading-ball loading-xs"></span>
            ) : (
              "+"
            )}
          </button>
        </div>
      </td>
      <td className="py-4">{currencyFormat(item.price * item.quantity)}</td>
      <td>
        {/* trash */}
        {loading ? (
          <span className="loading loading-ball loading-xs"></span>
        ) : (
          <svg
            className="cursor-pointer"
            fill="red"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            onClick={() => handleRemoveItem(item.productId, item.quantity)}
          >
            <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        )}
      </td>
    </tr>
  );
};

export default BasketItems;
