import { Outlet } from "react-router-dom";
import Header from "./Header";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Loading from "../../features/loading/Loading";
import { useGetBasketQuery } from "../api/agent";

function App() {
  const { isLoading, isError } = useGetBasketQuery();

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
