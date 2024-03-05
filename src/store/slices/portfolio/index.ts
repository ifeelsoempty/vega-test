import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import { Portfolio } from "./types";
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from "api/mocks/data";
import { fetchAssets } from "api";
import { fetchCollectedPortfolio } from "./actions";
import { Asset } from "api/types";
import { ServerEntity } from "store/types";

type State = {
  historicalDate: string,
  portfolio: ServerEntity<Portfolio | null>,
  startDatePortfolio: ServerEntity<Portfolio | null>
  assets: ServerEntity<Asset[]>,
}

const initialState: State = {
  historicalDate: LAST_AVAILABLE_DATE,
  portfolio: {
    isLoading: false,
    requested: false,
    data: null,
  },
  startDatePortfolio: {
    isLoading: false,
    requested: false,
    data: null,
  },
  assets: {
    isLoading: false,
    requested: false,
    data: [],
  },
};

export const getAssets = createAsyncThunk<Asset[], undefined, { rejectValue: string }>(
  "portfolio/getAssets", 
  async (_arg, { rejectWithValue }) => {
    const assets = await fetchAssets();
    
    if(!assets) {
      return rejectWithValue(`Redux: error has occured when trying to fetch assets`);
    }

    return assets
  }
);

export const getPortfolio = createAsyncThunk<Portfolio, undefined, { rejectValue: string }>(
  "portfolio/getPortfolio", 
  async (_arg, { getState, rejectWithValue }) => {
    try {
      const { portfolio: { assets, historicalDate } } = getState() as RootState;
      const portfolio = await fetchCollectedPortfolio(assets.data, historicalDate);

      return portfolio
    } catch {
      return rejectWithValue('Redux: error has occured when trying to fetch collected portfolio');
    }
  }
);

export const getStartDatePortfolio = createAsyncThunk<Portfolio, undefined, { rejectValue: string }>(
  "portfolio/getStartDatePortfolio", 
  async (_arg, { getState, rejectWithValue }) => {
    try {
      const { portfolio: { assets } } = getState() as RootState;
      const portfolio = await fetchCollectedPortfolio(assets.data, FIRST_AVAILABLE_DATE);

      return portfolio
    } catch {
      return rejectWithValue('Redux: error has occured when trying to fetch collected start date portfolio');
    }
  }
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setHistoricalDate: (state, action: PayloadAction<string>) => {
      state.historicalDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPortfolio.pending, (state) => {
      state.assets.error = '';
      state.portfolio.isLoading = true;
    });
    builder.addCase(getStartDatePortfolio.pending, (state) => {
      state.assets.error = '';
      state.startDatePortfolio.isLoading = true;
    });
    builder.addCase(getAssets.pending, (state) => {
      state.assets.error = '';
      state.assets.isLoading = true;
    });

    builder.addCase(getPortfolio.fulfilled, (state, action) => {
      state.portfolio.data = action.payload;
      state.portfolio.isLoading = false;
      state.portfolio.requested = true;
    });
    builder.addCase(getStartDatePortfolio.fulfilled, (state, action) => {
      state.startDatePortfolio.data = action.payload;
      state.startDatePortfolio.isLoading = false;
      state.startDatePortfolio.requested = true;
    });
    builder.addCase(getAssets.fulfilled, (state, action) => {
      state.assets.data = action.payload;
      state.assets.isLoading = false;
      state.assets.requested = true;
    });
    builder.addCase(getPortfolio.rejected, (state, action) => {
      state.assets.isLoading = false;
      state.assets.error = action.error.message;
    });
    builder.addCase(getStartDatePortfolio.rejected, (state, action) => {
      state.assets.isLoading = false;
      state.assets.error = action.error.message;
    });
    builder.addCase(getAssets.rejected, (state, action) => {
      state.assets.isLoading = false;
      state.assets.error = action.error.message;
    });
  },
});

export const { setHistoricalDate } = portfolioSlice.actions;