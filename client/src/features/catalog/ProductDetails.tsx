import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetProductDetailQuery,
} from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import Loading from "../loading/Loading";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/store/configureStore";
import { removeItem } from "../basket/basketSlice";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product | null>(null);
  const [qty, setQty] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { basket } = useAppSelector((a) => a.basket);

  const [deleteItem] = useDeleteItemMutation();
  const [addItem] = useCreateItemMutation();

  const { data: catalog, isLoading } = useGetProductDetailQuery({
    id: parseInt(id ?? "1"),
  });

  const item = basket?.items.find((e) => e.productId.toString() === id);

  useEffect(() => {
    const getItem = async () => {
      try {
        catalog && setProducts(catalog);
        item && setQty(item.quantity);
      } catch (error) {
        console.log(error);
      }
    };

    getItem();
  }, [catalog, item]);

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
      if (!allowUpdateQty) return;
      if (!products) return;

      setSubmitting(true);
      // add

      if (!item || qty > item.quantity) {
        const newQty = item ? qty - item.quantity : qty;
        addItem({ productId: products.id, qty: newQty });
        return;
      }

      //remove
      const newQty = item.quantity - qty;
      deleteItem({ productId: products.id, qty: newQty });

      dispatch(removeItem({ productId: products.id, quantity: newQty }));
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!products) return <NotFound />;
  return (
    <div className="card card-side bg-base-100 shadow-xl ">
      <figure>
        <img src={products.pictureUrl} alt="Movie" />
      </figure>
      <div className="card-body prose">
        <h1 className="card-title">{products.name}</h1>
        <h4 className="text-primary">${(products.price / 100).toFixed(2)}</h4>
        <h4 className="text-base-content">{products.description}</h4>

        <table className="table-auto">
          <tbody>
            <tr>
              <td>
                <span className="font-bold">Type</span>
              </td>
              <td>
                <span>{products.type}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Brand</span>
              </td>
              <td>{products.brand}</td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Quantity In Stock:</span>
              </td>
              <td>{products.quantityInStock}</td>
            </tr>
          </tbody>
        </table>

        <div className="justify-end join">
          <input
            type="number"
            placeholder="Qty"
            className="input input-bordered join-item w-fit rounded-l-full"
            value={qty}
            onChange={(e) => handleInputChange(e)}
          />
          <button
            className="btn join-item rounded-r-full"
            onClick={handleUpdateCart}
            disabled={submitting || !allowUpdateQty()}
          >
            {submitting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Add to cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
