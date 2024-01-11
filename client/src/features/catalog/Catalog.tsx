import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type props = {
  products: Product[];
};

function Catalog({ products }: props) {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        {products.map((e) => (
          <ProductCard key={e.id} product={e} />
        ))}
      </div>
    </>
  );
}

export default Catalog;
