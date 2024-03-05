import { fetchPortfolio, fetchPrices } from "api";
import { Asset } from "api/types";
import { Portfolio } from "./types";

export const fetchCollectedPortfolio = async (assets: Asset[], asOf: string): Promise<Portfolio> => {
  const portfolio = await fetchPortfolio({ params: { asOf }});

  if(!portfolio) throw new Error(`Redux: error has occured when trying to fetch prices`)

  if(!assets.length) {
    throw new Error('Redux: should request assets before requesting portfolio')
  }

  const userAssets = portfolio.positions.map((position) => {
    const assetName = assets.find((asset) => asset.id === position.asset)?.name

    if(!assetName) {
      throw new Error(`Redux: there is no such asset with id '${position.asset}'`)
    }

    return assetName
  });

  const prices = await fetchPrices({ params: {
    asOf,
    assets: userAssets.join(',')
  }})

  if(!prices) throw new Error(`Redux: error has occured when trying to fetch prices`)

  const positions = portfolio.positions.map((position) => {
    const positionAsset = assets.find((asset) => asset.id === position.asset);

    if(!positionAsset) {
      throw new Error(`Redux: there is no such asset with id '${position.asset}'`)
    }

    const price = prices.find((price) => price.asset === positionAsset.name);

    if(!price) {
      throw new Error(`Redux: can't find price for '${positionAsset.name}'`)
    }

    return ({
      id: position.id,
      asOf: position.asOf,
      asset: {
        id: positionAsset.id,
        name: positionAsset.name,
        class: positionAsset.class,
        price: price.price,
      },
      quantity: position.quantity,
      price: position.price,
    })
  })

  return {
    id: portfolio.id,
    asOf,
    positions
  };
}