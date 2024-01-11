import { Outlet } from "react-router-dom";
import Header from "./Header";
import MaxWidthWrapper from "./MaxWidthWrapper";

function App() {
  return (
    <>
      <div>
        <MaxWidthWrapper>
          <Header />
          <Outlet />
        </MaxWidthWrapper>
      </div>
    </>
  );
}

export default App;
