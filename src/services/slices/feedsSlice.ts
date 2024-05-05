import { getFeedsApi } from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface FeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isInit: boolean;
  isLoading: boolean;
  error: SerializedError | null;
}

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isInit: false,
  isLoading: false,
  error: null
};

export const getFeedsThunk = createAsyncThunk('feeds/get', async () => {
  const ingredients = await getFeedsApi();
  return ingredients;
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeedsOrders: (sliceState) => sliceState.orders,
    selectFeedsLoading: (sliceState) => sliceState.isLoading,
    selectFeedsInit: (sliceState) => sliceState.isInit,
    selectFeedsTotal: (sliceState) => sliceState.total,
    selectFeedsTotalToday: (sliceState) => sliceState.totalToday,
    selectFeedsError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const {
  selectFeedsOrders,
  selectFeedsLoading,
  selectFeedsInit,
  selectFeedsTotal,
  selectFeedsTotalToday,
  selectFeedsError
} = feedsSlice.selectors;
//export const { init } = ingredientsSlice.actions;
export default feedsSlice.reducer;