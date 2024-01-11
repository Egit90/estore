import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import agent from "../../app/api/agent";
import ProductCardSkeleton from "./ProductCardSkeleton";

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await agent.Catalog.list();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, []);

  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        {loading && <ProductCardSkeleton count={20} />}
        {products.map((e) => (
          <ProductCard key={e.id} product={e} />
        ))}
      </div>
    </>
  );
}

export default Catalog;
