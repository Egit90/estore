import { useLocation } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  console.log(location.state);
  const data = location.state.data;

  return <div>Thanks For your order {data}</div>;
};

export default Confirmation;
