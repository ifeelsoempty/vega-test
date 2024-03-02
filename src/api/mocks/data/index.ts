import USD from './historicalPrices/USD.json'
import VOO from './historicalPrices/VOO.json'
import AAPL from './historicalPrices/AAPL.json'
import BTC from './historicalPrices/BTC.json'
import ETH from './historicalPrices/ETH.json'
import GBP from './historicalPrices/GBP.json'
import GOVT from './historicalPrices/GOVT.json'
import IAUM from './historicalPrices/IAUM.json'
import META from './historicalPrices/META.json'
import TSLA from './historicalPrices/TSLA.json'
import { Asset, AssetName, Portfolio, Position } from 'api/types'

export const FIRST_AVAILABLE_DATE = '2023-11-27'
export const LAST_AVAILABLE_DATE = '2024-03-03'

type HistoricalPrices = Record<AssetName, Record<string, number>>

type PortfolioBase = {
  id: Portfolio['id'],
  positions: Array<Omit<Position, 'price' | 'asOf' | 'asset'> & { assetName: AssetName }>
}

export const ASSETS: Asset[] = [
  {
    id: '838ea10b-1475-4fae-b36c-f8d49105df23',
    name: 'USD',
    class: 'cash',
  },
  {
    id: '91b25f41-ef89-48a9-83ca-83905b6bf2be',
    name: 'AAPL',
    class: 'stocks',
  },
  {
    id: 'd16d1c2b-4eae-40ac-835e-989625cce03e',
    name: 'BTC',
    class: 'cryptocurrency',
  },
  {
    id: '747e177d-2ae3-4d05-9808-2021f8b149a9',
    name: 'ETH',
    class: 'cryptocurrency',
  },
  {
    id: 'ac49cad8-2a2b-4c87-a7b6-412e95d940dd',
    name: 'GBP',
    class: 'cash',
  },
  {
    id: '38c39225-ef31-4c24-b0bc-b1a6272564cf',
    name: 'GOVT',
    class: 'stocks',
  },
  {
    id: 'bb1f7c6c-ea73-430f-bbbb-8e15c2549f94',
    name: 'IAUM',
    class: 'stocks',
  },
  {
    id: '960c6e1d-a330-4abc-ac9f-e540bf5d0fd5',
    name: 'META',
    class: 'stocks',
  },
  {
    id: 'ba34a39d-fbc4-4a09-a95e-457aa6cfe0ee',
    name: 'TSLA',
    class: 'stocks',
  },
  {
    id: 'dd9745b8-eb92-475c-b8f9-0e5d34b91775',
    name: 'VOO',
    class: 'stocks',
  },
]

export const ASSET_NAMES = ASSETS.map((asset) => asset.name)

export const PORTFOLIO_BASE: PortfolioBase = {
  id: '08e6fe2d-8918-4c71-b059-aad195e8c363',
  positions: [
    {
      id: 1,
      assetName: 'BTC',
      quantity: 0.2125,
    },
    {
      id: 2,
      assetName: 'USD',
      quantity: 22321,
    },
    {
      id: 3,
      assetName: 'GBP',
      quantity: 4000,
    },
    {
      id: 4,
      assetName: 'AAPL',
      quantity: 23,
    },
    {
      id: 5,
      assetName: 'ETH',
      quantity: 3.23444212312313441,
    },
    {
      id: 6,
      assetName: 'GOVT',
      quantity: 1202,
    },
    {
      id: 7,
      assetName: 'IAUM',
      quantity: 812,
    },
    {
      id: 8,
      assetName: 'META',
      quantity: 8,
    },
    {
      id: 9,
      assetName: 'TSLA',
      quantity: 34,
    },
  ]
}

export const HISTORICAL_PRICES: HistoricalPrices = {
  USD,
  VOO,
  AAPL,
  BTC,
  ETH,
  GBP,
  GOVT,
  IAUM,
  META,
  TSLA
}
