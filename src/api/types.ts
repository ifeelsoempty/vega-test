
export type AssetName = 'USD' | 'AAPL' | 'BTC' | 'ETH' | 'GBP' | 'GOVT' | 'IAUM' | 'META' | 'TSLA' | 'VOO' 
export type AssetClass = 'cryptocurrency' | 'stocks' | 'cash'

export type Response<T> =  {
  description: string,
  content: T
}

export type Position = {
  id: number,
  asset: string,
  quantity: number,
  asOf: string,
  price: number,
}

export type Portfolio = {
  id: string,
  asOf: string,
  positions: Position[]
}

export type Price = {
  id: string,
  asset: AssetName,
  price: number,
}

export type Asset = {
  id: string,
  name: AssetName,
  class: AssetClass,
}
