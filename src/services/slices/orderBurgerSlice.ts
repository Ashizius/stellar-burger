import { SerializedError, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerThunk } from '../actions';

interface TOrderState {
  order: TOrder | null;
  orderRequest: boolean;
  orderError: SerializedError | null;
}

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderError: null
};

const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    selectOrderModalData: (sliceState) => sliceState.order,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderBurgerError: (sliceState) => sliceState.orderError
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state, action) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.order;
      });
  }
});

export default orderBurgerSlice.reducer;

export const {
  selectOrderBurgerError,
  selectOrderModalData,
  selectOrderRequest
} = orderBurgerSlice.selectors;
export const { clearOrder } = orderBurgerSlice.actions;
