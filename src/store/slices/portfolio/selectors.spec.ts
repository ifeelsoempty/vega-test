import { ServerEntity } from "store/types";
import { AssetName } from "api/types";
import { selectAssetPriceDifference, selectTotalBalanceDifference } from "./selectors";
import { Portfolio, PriceDifference } from "./types";

const mockPortfolio: ServerEntity<Portfolio> = {
  requested: true,
  isLoading: false,
  data: {
    id: '08e6fe2d-8918-4c71-b059-aad195e8c363',
    asOf: '2024-02-05',
    positions: [
      {
        id: 1,
        asset: {
          id: '838ea10b-1475-4fae-b36c-f8d49105df23',
          name: 'USD',
          class: 'cash',
          price: 1
        },
        price: 100,
        quantity: 100,
        asOf: '2024-02-05',
      },
      {
        id: 1,
        asset: {
          id: '838ea10b-1475-4fae-b36c-f8d49105df23',
          name: 'BTC',
          class: 'cryptocurrency',
          price: 42661.1354
        },
        price: 12798.34062,
        quantity: 0.3,
        asOf: '2024-02-05',
      },
    ]
  }
}

const mockStartDatePortfolio: ServerEntity<Portfolio> = {
  requested: true,
  isLoading: false,
  data: {
    id: '08e6fe2d-8918-4c71-b059-aad195e8c363',
    asOf: '2023-11-27',
    positions: [
      {
        id: 1,
        asset: {
          id: '838ea10b-1475-4fae-b36c-f8d49105df23',
          name: 'USD',
          class: 'cash',
          price: 1
        },
        price: 100,
        quantity: 100,
        asOf: '2023-11-27',
      },
      {
        id: 1,
        asset: {
          id: '838ea10b-1475-4fae-b36c-f8d49105df23',
          name: 'BTC',
          class: 'cryptocurrency',
          price: 37247.7484
        },
        price: 11174.3245,
        quantity: 0.3,
        asOf: '2023-11-27',
      },
    ]
  }
}

describe('selectTotalBalanceDifference', () => {
  it('should return an `PriceDifference` object', () => {
    const result = selectTotalBalanceDifference.resultFunc(mockPortfolio, mockStartDatePortfolio);

    expect(result).toHaveProperty<number>('number')
    expect(result).toHaveProperty<number>('percent')
  });

  it('should calculate `number` and `percent` correctly for total balance', () => {
    const portfolio = mockPortfolio;
    const startDatePortfolio = mockStartDatePortfolio;

    const result = selectTotalBalanceDifference.resultFunc(portfolio, startDatePortfolio);

    expect(result).toEqual<PriceDifference>({
      percent: 14.40455363866811,
      number: 1624.0161200000002,
    })
  });
});

describe('selectAssetPriceDifference', () => {
  it('should return an object with asset names as keys and `PriceDifference` objects as values', () => {
    const portfolio = mockPortfolio;
    const startDatePortfolio = mockStartDatePortfolio;

    const result = selectAssetPriceDifference.resultFunc(portfolio, startDatePortfolio);

    expect(result).toHaveProperty<AssetName>('USD')
    expect(result['USD']).toHaveProperty<number>('number')
    expect(result['USD']).toHaveProperty<number>('percent')
  });

  it('should calculate `number` and `percent` correctly for each asset', () => {
    const result = selectAssetPriceDifference.resultFunc(mockPortfolio, mockStartDatePortfolio);

    expect(result['BTC']).toEqual<PriceDifference>({
      percent: 14.533461239648087,
      number: 1624.0161200000002
    });
  });

  it('should throw an error if an asset is missing in the start date portfolio', () => {
    const startDatePortfolio = { 
      ...mockStartDatePortfolio, 
      data: { 
        ...mockStartDatePortfolio.data, 
        positions: [
          mockStartDatePortfolio.data.positions[1]
        ] 
      } 
    };

    expect(() => selectAssetPriceDifference.resultFunc(mockPortfolio, startDatePortfolio)).toThrow();
  });

  it("should return correct data if there's an asset in the start date portfolio which is missing in the portfolio", () => {
    const portfolio = { 
      ...mockPortfolio, 
      data: { 
        ...mockPortfolio.data, 
        positions: [
          mockPortfolio.data.positions[0]
        ] 
      } 
    };

    const result = selectAssetPriceDifference.resultFunc(portfolio, mockStartDatePortfolio);

    expect(result['USD']).toEqual<PriceDifference>({
      percent: 0,
      number: 0
    })
  });

  it("should return empty object if there's no positions", () => {
    const portfolio = { ...mockPortfolio, data: { ...mockPortfolio.data, positions: [] } };

    const result = selectAssetPriceDifference.resultFunc(portfolio, mockStartDatePortfolio);
    
    expect(result).toEqual({});
  });
});
