import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import NotFound from "../../app/errors/NotFound";
import Loading from "../loading/Loading";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { useCreateItemMutation, useDeleteItemMutation } from "../../app/api/basketApi";
import { useGetProductDetailQuery } from "../../app/api/catalogApi";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [qty, setQty] = useState(0);
  const { basket } = useAppSelector((a) => a.basket);

  const [deleteItem, { isLoading: isDeleteLoading, error: deleteError }] = useDeleteItemMutation();

  const [addItem, { isLoading: isCreateItemLoading }] = useCreateItemMutation();

  const { data: products, isLoading } = useGetProductDetailQuery({
    id: parseInt(id ?? "1"),
  });

  const item = basket?.items.find((e) => e.productId.toString() === id);

  useEffect(() => {
    if (item) setQty(item.quantity);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    if (v >= 0) setQty(v);
  };

  const allowUpdateQty = () => {
    if (item && item.quantity === qty) return false;
    if (!item && qty == 0) return false;
    return true;
  };

  const handleUpdateCart = async () => {
    try {
      if (!allowUpdateQty || !products) return;

      if (!item || qty > item.quantity) {
        const newQty = item ? qty - item.quantity : qty;
        addItem({ productId: products.id, qty: newQty });
        return;
      }

      //remove
      const newQty = item.quantity - qty;
      deleteItem({ productId: products.id, qty: newQty });
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    }
  };

  if (deleteError) {
    toast.error(`Error Performing the delete actcion ${"data" in deleteError && deleteError.data}`);
  }

  if (isLoading || isDeleteLoading || isCreateItemLoading) return <Loading />;
  if (!products) return <NotFound />;
  return (
    <div className="card card-side bg-base-100 shadow-xl ">
      <figure>
        <img src={products.pictureUrl} alt="Movie" />
      </figure>
      <div className="card-body prose">
        <ItemTable product={products} />
        <div className="justify-end join">
          <input type="number" placeholder="Qty" className="input input-bordered join-item w-fit rounded-l-full" value={qty} onChange={(e) => handleInputChange(e)} />
          <button className="btn join-item rounded-r-full" onClick={handleUpdateCart} disabled={isDeleteLoading || !allowUpdateQty()}>
            {isDeleteLoading || isCreateItemLoading ? <span className="loading loading-spinner loading-md"></span> : "Update Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemTable = ({ product }: { product: Product }) => {
  return (
    <>
      <h1 className="card-title">{product.name}</h1>
      <h4 className="text-primary">{currencyFormat(product.price)}</h4>
      <h4 className="text-base-content">{product.description}</h4>
      <table className="table-auto">
        <tbody>
          <tr>
            <td>
              <span className="font-bold">Type</span>
            </td>
            <td>
              <span>{product.type}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="font-bold">Brand</span>
            </td>
            <td>{product.brand}</td>
          </tr>
          <tr>
            <td>
              <span className="font-bold">Quantity In Stock:</span>
            </td>
            <td>{product.quantityInStock}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ProductDetails;
