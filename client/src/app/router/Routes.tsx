import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import SingleOrder from "../../features/orders/SingleOrder";
import CheckoutWrapper from "../../features/checkOut/CheckoutWrapper";
import Confirmation from "../../features/checkOut/Confirmation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "checkout", element: <CheckoutWrapper /> },
          { path: "orders", element: <Orders /> },
          { path: "singleOrder", element: <SingleOrder /> },
          { path: "confirmation", element: <Confirmation /> },
        ],
      },
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "basket", element: <BasketPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
