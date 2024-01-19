// src/redux/prsDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const prsDataSlice = createSlice({
  name: 'prsData',
  initialState: {},
  reducers: {
    setPRsData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPRsData } = prsDataSlice.actions;
export default prsDataSlice.reducer;
