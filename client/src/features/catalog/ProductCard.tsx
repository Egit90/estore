import { Product } from "../../app/models/product";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="card card-compact w-80 bg-base-100 shadow-xl">
      <figure className="bg-secondary">
        <img src={product.pictureUrl} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <h2 className="card-title">${(product.price / 100).toFixed(2)}</h2>
        <p>
          {product.brand} / {product.type}{" "}
        </p>
        <div className="card-actions justify-between">
          <button className="btn btn-primary btn-sm rounded-md">View</button>
          <button className="btn btn-primary btn-sm rounded-md">
            Add To Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
