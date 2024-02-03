import Loading from "../loading/Loading";

const Confirmation = ({ orderNumber, isLoading }: { orderNumber: number; isLoading: boolean }) => {
  if (isLoading) return <Loading />;
  return <div>Thanks For your order {orderNumber}</div>;
};

export default Confirmation;
 