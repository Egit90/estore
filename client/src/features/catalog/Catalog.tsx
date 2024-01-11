import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProduct = async () => {
      const resp = await fetch("https://localhost:5000/api/products");
      const data = await resp.json();
      setProducts(data);
    };

    getProduct();
  }, []);

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
