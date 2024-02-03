import { useLocation } from "react-router-dom";
import BasketItems from "../basket/BasketItems";
import { orderDto } from "../../app/models/orderDto";

const SingleOrder = () => {
  const location = useLocation();
  const data: orderDto = location.state.data;
  return (
    <div className="flex flex-col w-full bg-base-300 rounded-lg p-8 ">
      <div className="flex flex-col justify-center items-center">
        <p>
          <span className="font-bold"> Order ID: </span>
          {data.id}
        </p>
        <p>
          <span className="font-bold"> Order Date: </span>
          {new Date(data.orderDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-bold"> Order Status: </span>
            {data.orderStatus}
        </p>
      </div>
      <div className="overflow-y-scroll max-h-[40vh]">
        <table className="w-full">
          {data.orderItems.map((e) => (
            <BasketItems item={e} showOnly={true} />
          ))}
        </table>
      </div>
    </div>
  );
};

export default SingleOrder;
