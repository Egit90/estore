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
  status: number;
}

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { data, status } = action.payload as CustomError;
    if (data) {
      switch (data.status) {
        case 404:
          toast.error("404 Not Found");
          break;
        case 400:
          if (data.errors) {
            const modelStateErrors: string[] = [];
            ``;
            for (const key in data.errors) {
              if (data.errors[key]) modelStateErrors.push(data.errors[key]);
            }
            throw modelStateErrors.flat();
          }
          toast.error(data.title);
          break;
        case 401:
          toast.error(data.title);
          return Promise.reject(data.title);
        case 500:
          router.navigate("/server-error", { state: { error: data } });
          break;
        default:
          break;
      }
    }

    if (!data && status === 404) toast.error("404 Not Found");
  }

  return next(action);
};
