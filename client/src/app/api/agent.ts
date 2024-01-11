import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../models/product";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "https://localhost:5000/api/";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

axios.interceptors.response.use(
  async (resp) => {
    await sleep();
    return resp;
  },
  (err: AxiosError) => {
    const { data, status } = err.response as AxiosResponse;

    switch (status) {
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

    return Promise.reject(err.response);
  }
);

// Catalog
const request = {
  get: async (url: string) => (await axios.get(url)).data,
  post: async (url: string, body: object) => (await axios.post(url, body)).data,
  put: async (url: string, body: object) => (await axios.put(url, body)).data,
  delete: async (url: string) => (await axios.delete(url)).data,
};

const Catalog = {
  list: async (): Promise<Product[]> => await request.get("products"),
  details: async (id: number): Promise<Product> =>
    await request.get(`products/${id}`),
};

//Error APi
const TestErrors = {
  get404Error: async () => await request.get("Buggy/not-found"),
  get400Error: async () => await request.get("Buggy/bad-request"),
  get401Error: async () => await request.get("Buggy/unauthorized"),
  getValidationError: async () => await request.get("Buggy/validation-error"),
  get500Error: async () => await request.get("Buggy/server-error"),
};

const agent = {
  Catalog,
  TestErrors,
};

export default agent;
