import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { currencyFormat } from "../../app/util/util";
import { useAppSelector } from "../../app/store/configureStore";
import { useCreateItemMutation } from "../../app/api/agent";

const ProductCard = ({ product }: { product: Product }) => {
  const { status } = useAppSelector((e) => e.basket);
  const [addItem] = useCreateItemMutation();

  const addToCartButtonContent = status.includes("pending") ? (
    <span className="loading loading-dots loading-xs"></span>
  ) : (
    "Add To Cart"
  );

  return (
    <div className="card card-compact w-80 bg-base-100 shadow-xl">
      <Link to={`/catalog/${product.id}`}>
        <figure className="bg-secondary">
          <img src={product.pictureUrl} alt={product.name} />
        </figure>
      </Link>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <h2 className="card-title">{currencyFormat(product.price)} </h2>
        <p>
          {product.brand} / {product.type}{" "}
        </p>
        <div className="card-actions justify-between">
          <button
            className="btn btn-primary btn-sm rounded-md"
            onClick={() => addItem({ productId: product.id })}
            disabled={status.includes("pending")}
          >
            {addToCartButtonContent}
          </button>
          <Link
            className="btn btn-primary btn-sm rounded-md"
            to={`/catalog/${product.id}`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
