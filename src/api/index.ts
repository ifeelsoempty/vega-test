import axios, { AxiosRequestConfig } from "axios"
import { Modal } from "antd";

import { Response, type Portfolio, Price, Asset } from "./types"

const api = axios.create({
  baseURL: '/',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data.message || 'An error occurred while executing the request, please try again later';

      Modal.error({
        title: `Error ${status}`,
        content: errorMessage,
      });
    } else {
      Modal.error({
        title: 'Unknown error',
        content: 'An error occurred, try again later',
      });
    }

    return Promise.reject(error);
  }
);

export const fetchAssets = () => {
  return api.get<Response<Asset[]>>('/assets').then((res) => res.data.content)
}

export const fetchPrices = (config?: AxiosRequestConfig) => {
  return api.get<Response<Price[]>>('/prices', config).then((res) => res.data.content)
}

export const fetchPortfolio = (config?: AxiosRequestConfig) => {
  return api.get<Response<Portfolio>>('/portfolios', config).then((res) => res.data.content)
}
