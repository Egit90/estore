import { Outlet } from "react-router-dom";
import Header from "./Header";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useEffect } from "react";
import { getCookie } from "../util/util";
import Loading from "../../features/loading/Loading";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";
import { useGetBasketQuery } from "../api/agent";

function App() {
  const dispatch = useAppDispatch();

  const { data: basket, isLoading, isError } = useGetBasketQuery();

  useEffect(() => {
    const getBasket = async () => {
      try {
        const buyerId = getCookie("buyerId");
        if (!buyerId) return;
        dispatch(setBasket(basket));
      } catch (error) {
        console.log(error);
      }
    };

    getBasket();
  }, [basket, dispatch]);

  if (isLoading) return <Loading />;
  if (isError) toast.error("Error getting the basket");
  return (
    <>
      <div>
        <MaxWidthWrapper>
          <Header />
          <ToastContainer
            position="bottom-right"
            hideProgressBar
            theme="colored"
          />
          <Outlet />
        </MaxWidthWrapper>
      </div>
    </>
  );
}

export default App;
