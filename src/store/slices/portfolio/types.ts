import { AssetClass, AssetName } from "api/types"

export type Position = {
  id: number,
  asOf: string,
  asset: {
    id: string,
    name: AssetName,
    class: AssetClass,
    price: number,
  },
  quantity: number,
  price: number,
}

export type Portfolio = {
  id: string,
  asOf: string,
  positions: Position[],
}

export type PriceDifference = {
  number: number,
  percent: number
}