import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../../app/api/ordersApi";
import { currencyFormat } from "../../app/util/util";
import Loading from "../loading/Loading";

const Orders = () => {
  const { data, isLoading } = useGetOrdersQuery();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Id</th>
            <th>Order Date</th>
            <th>Total</th>
            <th>Statue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((e) => (
              <tr key={e.id} className="bg-base-200">
                <th>{e.id}</th>
                <th>{new Date(e.orderDate).toLocaleDateString()} </th>
                <td>{currencyFormat(e.total)}</td>
                <td>{e.orderStatus}</td>
                <td>
                  <button className="btn btn-circle btn-info" onClick={() => navigate("/singleOrder", { state: { data: e } })}>
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
