import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";

const ProductDetails = () => {
  let { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product | null>(null);
  const [loading, setLoging] = useState(true);

  useEffect(() => {
    const getItem = async () => {
      try {
        setLoging(true);
        let p = await axios.get(`https://localhost:5000/api/products/${id}`);
        setProducts(p.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoging(false);
      }
    };
    getItem();
  }, [id]);

  if (loading) return <h2>Loading</h2>;
  if (!products) return <h2>Product Not Found</h2>;
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

        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
