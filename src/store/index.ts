import { configureStore } from "@reduxjs/toolkit";

import { portfolioSlice } from "./slices/portfolio";

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;