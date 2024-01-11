import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";

function App() {
  const [product, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProduct = async () => {
      const resp = await fetch("https://localhost:5000/api/products");
      const data = await resp.json();
      setProducts(data);
    };

    getProduct();
  }, []);

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: 2,
        name: "ELie",
        description:
          "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
        price: 15000,
        pictureUrl: "/images/products/sb-ang2.png",
        type: "Boards",
        brand: "Angular",
        quantityInStock: 100,
      },
    ]);
  };

  return (
    <>
      <div>
        <Header />
        <Catalog products={product} addProduct={addProduct} />
      </div>
    </>
  );
}

export default App;
