import { HttpResponse, http } from 'msw'

import { Asset, AssetName, Portfolio, Position, Price, Response } from '../types'
import { ASSETS, ASSET_NAMES, HISTORICAL_PRICES, LAST_AVAILABLE_DATE, PORTFOLIO_BASE } from './data'

const delay = (delayInms: number) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

const shortenNumber = (price: number) => Number((price).toFixed(4))

const getPriceByAsset = (currentAsset: AssetName, asOf: string): Price | undefined => {
  const id = ASSETS.find((asset) => asset.name === currentAsset)?.id;

  if(!id) return

  if (HISTORICAL_PRICES[currentAsset]) {
    let closestDate = '';

    for (const date of Object.keys(HISTORICAL_PRICES[currentAsset])) {
      if (date <= asOf && (!closestDate || date > closestDate)) {
        closestDate = date;
      }
    }

    if (closestDate) {
      return {
        id,
        asset: currentAsset,
        price: shortenNumber(HISTORICAL_PRICES[currentAsset][closestDate]),
      };
    }
  }
}

function getPriceList(requestedAssets: AssetName[], asOf: string): Price[] {
  const result: Price[] = [];

  for (const currentAsset of requestedAssets) {
    const price = getPriceByAsset(currentAsset, asOf);

    price && result.push(price);
  }

  return result;
}

export const handlers = [
  http.get<never, never, Response<Portfolio>>('/portfolios', async ({ request }) => {
    const searchParams = new URL(request.url).searchParams
    const asOf = searchParams.get('asOf') ?? LAST_AVAILABLE_DATE;

    const positions: Position[] = [];
    
    PORTFOLIO_BASE.positions.forEach((position) => {
      const asset = ASSETS.find((asset) => asset.name === position.assetName)?.id;
      const price = getPriceByAsset(position.assetName, asOf)?.price;

      if(!asset || !price) return

      positions.push(
        {
          id: position.id,
          asset,
          quantity: shortenNumber(position.quantity),
          asOf,
          price: shortenNumber(price * position.quantity),
        }
      )
    })

    const response: Response<Portfolio> = {
      description: 'successful operation',
      content: {
        id: PORTFOLIO_BASE.id,
        asOf,
        positions: positions.sort((a, b) => a.price + b.price),
      }
    };
    
    // Imitate loading
    await delay(250);

    return HttpResponse.json(response) 
  }),
  http.get<never, never, Response<Price[]>>('/prices', async ({ request }) => {
    const searchParams = new URL(request.url).searchParams

    const asOfParam = searchParams.get('asOf'); 
    const assetsParam = searchParams.get('assets')?.split(',');

    const asOf = asOfParam ?? LAST_AVAILABLE_DATE;
    const assets = assetsParam?.filter((asset) => {
      return ASSET_NAMES.includes(asset as AssetName)
    }) as AssetName[] ?? ASSET_NAMES;

    const response = {
      description: 'successful operation',
      content: getPriceList(assets, asOf)
    }
    await delay(250);

    return HttpResponse.json(response)
  }),
  http.get<never, never, Response<Asset[]>>('/assets', () => {
    const response = {
      description: 'successful operation',
      content: ASSETS
    };

    return HttpResponse.json(response)
  }),
]
