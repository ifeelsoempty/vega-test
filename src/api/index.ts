import axios, { AxiosRequestConfig } from "axios"
import { Response, type Portfolio, Price, Asset } from "./types"

export const fetchAssets = () => {
  return  axios.get<Response<Asset[]>>('/assets').then((res) => res.data.content)
}

export const fetchPrices = (config?: AxiosRequestConfig) => {
  return axios.get<Response<Price[]>>('/prices', config).then((res) => res.data.content)
}

export const fetchPortfolio = (config?: AxiosRequestConfig) => {
  return axios.get<Response<Portfolio>>('/portfolios', config).then((res) => res.data.content)
}
