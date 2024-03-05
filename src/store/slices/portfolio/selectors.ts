import { createSelector } from "@reduxjs/toolkit";

import { ServerEntity } from "store/types";
import { Portfolio, PriceDifference } from "./types";
import { AssetName } from "api/types";
import { RootState } from "../..";

const getPortfolioTotalBalance = (portfolio: ServerEntity<Portfolio | null>) => {
  return portfolio.data?.positions.reduce<number>((acc, position) => {
    return acc + position.price
  }, 0) ?? 0
} 

export const selectHistoricalDate = (state: RootState) => state.portfolio.historicalDate;

export const selectPortfolio = (state: RootState) => state.portfolio.portfolio;

export const selectStartDatePortfolio = (state: RootState) => state.portfolio.startDatePortfolio;

export const selectAssets = (state: RootState) => state.portfolio.assets;

export const selectTotalBalance = (state: RootState) => {
  return getPortfolioTotalBalance(state.portfolio.portfolio)
}

export const selectTotalBalanceDifference = createSelector(
  [selectPortfolio, selectStartDatePortfolio],
  (portfolio, startDatePortfolio): PriceDifference => {
    const newValue = getPortfolioTotalBalance(portfolio);
    const oldValue = getPortfolioTotalBalance(startDatePortfolio);
    const numberDifference = newValue - oldValue;

    return {
      number: numberDifference,
      percent: numberDifference / (Math.abs(oldValue)) * 100,
    }
  }
)

export const selectAssetPriceDifference = createSelector(
  [selectPortfolio, selectStartDatePortfolio], 
  (portfolio, startDatePortfolio): Record<AssetName, PriceDifference> => {
    const startDatePortfolioAssets = new Map<AssetName, number>();
    const result = new Map<AssetName, PriceDifference>();

    startDatePortfolio.data?.positions.forEach((position) => {
      startDatePortfolioAssets.set(position.asset.name, position.price)
    })

    portfolio.data?.positions.forEach((position) => {
      const oldValue = startDatePortfolioAssets.get(position.asset.name)
      const newValue = position.price;
      
      if(!oldValue) throw new Error(`Redux: can't find asset ${position.asset.name}`);

      const numberDifference = newValue - oldValue;

      result.set(position.asset.name, {
        number: numberDifference,
        percent: numberDifference / (Math.abs(oldValue)) * 100,
      })
    })

    return Object.fromEntries(result) as Record<AssetName, PriceDifference>;
  }
)
