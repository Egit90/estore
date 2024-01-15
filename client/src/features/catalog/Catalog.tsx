import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import { useGetCatalogQuery } from "../../app/api/agent";
import ProductCardSkeleton from "./ProductCardSkeleton";

function Catalog() {
  const [products, setProducts] = useState<Product[] | undefined>([]);
  const { data: catalog, isLoading } = useGetCatalogQuery();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setProducts(catalog);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProduct();
  }, [catalog]);

  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        {isLoading && <ProductCardSkeleton count={20} />}
        {products &&
          products.map((e) => <ProductCard key={e.id} product={e} />)}
      </div>
    </>
  );
}

export default Catalog;
