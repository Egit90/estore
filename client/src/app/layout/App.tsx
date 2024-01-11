import { Outlet } from "react-router-dom";
import Header from "./Header";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

function App() {
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
