import axios, { AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SELF_API_URL
    ? process.env.NEXT_PUBLIC_SELF_API_URL
    : `${process.env.NEXT_PUBLIC_VERCEL_URL}/api`,
});

export const setToken = (token: string): void => {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
};

export const deleteToken = (): void => {
  delete api.defaults.headers["Authorization"];
};

export const setCustomHeader = (header: string, value: string): void => {
  api.defaults.headers[header] = value;
};

export const deleteCustomHeader = (header: string): void => {
  delete api.defaults.headers[header];
};

type AxiosOnFulfilled = (
  value: AxiosResponse<any>
) => AxiosResponse<any> | Promise<AxiosResponse<any>>;
type AxiosOnRejected = (error: any) => any;
export const setInterceptor = (
  success: AxiosOnFulfilled,
  error: AxiosOnRejected
): void => {
  api.interceptors.response.use(success, error);
};
