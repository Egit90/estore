import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Middleware } from "redux";
import { router } from "../router/Routes";

interface CustomError {
  data: {
    status: number;
    title: string;
    errors: { [key: string]: string };
  };
}

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn("We got a rejected action!");

    const { data } = action.payload as CustomError;

    switch (data.status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) modelStateErrors.push(data.errors[key]);
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
  }

  return next(action);
};
