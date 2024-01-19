// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import contributionsReducer from './contributionSlice';
import prsDataReducer from './prsDataSlice';

export const store = configureStore({
  reducer: {
    contributions: contributionsReducer,
    prsData: prsDataReducer,
  },
});
