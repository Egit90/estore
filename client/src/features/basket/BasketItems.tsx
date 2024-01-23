import { BasketItem } from "../../app/models/basket";
import { toast } from "react-toastify";
import { currencyFormat } from "../../app/util/util";
import { Link } from "react-router-dom";
import { useCreateItemMutation, useDeleteItemMutation } from "../../app/api/basketApi";

const BasketItems = ({ item }: { item: BasketItem }) => {
  const [deleteItem, { isLoading: isDeleteLoading, error: deleteError }] = useDeleteItemMutation();
  const [addItem, { isLoading: isAddLoading, error: addError }] = useCreateItemMutation();

  const handleAddItem = async (productID: number) => {
    try {
      addItem({ productId: productID });
    } catch (error) {
      toast.error("Failed to add Item");
    }
  };

  const handleRemoveItem = async (ProductId: number, qty: number) => {
    try {
      deleteItem({ productId: ProductId, qty: qty });
    } catch (error) {
      toast.error("Failed to remove Item");
    }
  };

  if (deleteError) toast.error(`Failed to Remove = ${"data" in deleteError && deleteError.data}`);

  if (addError) toast.error(`Failed to Remove = ${"data" in addError && addError.data}`);

  return (
    <tr>
      <td className="py-4">
        <div className="flex items-center">
          <Link to={`/catalog/${item.productId}`}>
            <img className="h-16 w-16 mr-4" src={item.pictureUrl} alt="Product image" />
          </Link>
          <span className="font-semibold">{item.name}</span>
        </div>
      </td>
      <td className="py-4">{currencyFormat(item.price)}</td>
      <td className="py-4">
        <div className="flex items-center">
          <button className="border rounded-md py-2 px-4 mr-2" onClick={() => handleRemoveItem(item.productId, 1)}>
            {isDeleteLoading ? <span className="loading loading-ball loading-xs"></span> : "-"}
          </button>
          <span className="text-center w-8">{item.quantity}</span>
          <button className="border rounded-md py-2 px-4 ml-2" onClick={() => handleAddItem(item.productId)}>
            {isAddLoading ? <span className="loading loading-ball loading-xs"></span> : "+"}
          </button>
        </div>
      </td>
      <td className="py-4">{currencyFormat(item.price * item.quantity)}</td>
      <td>
        {/* trash */}
        {isAddLoading || isDeleteLoading ? (
          <span className="loading loading-ball loading-xs"></span>
        ) : (
          <svg className="cursor-pointer" fill="red" viewBox="0 0 16 16" height="1em" width="1em" onClick={() => handleRemoveItem(item.productId, item.quantity)}>
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
