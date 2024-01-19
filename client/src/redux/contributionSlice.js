// src/redux/contributionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const contributionsSlice = createSlice({
  name: 'contributions',
  initialState: [],
  reducers: {
    setContributions: (state, action) => {
      return action.payload;
    },
  },
});

export const { setContributions } = contributionsSlice.actions;
export default contributionsSlice.reducer;
