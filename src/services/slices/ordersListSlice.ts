import { SerializedError, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersThunk, viewOrderThunk } from '../actions';

interface TOrdersListState {
  order: TOrder | null;
  orders: TOrder[];
  orderRequest: boolean;
  orderNumber: number | null;
  ordersRequest: boolean;
  ordersError: SerializedError | null;
  orderError: SerializedError | null;
}

const initialState: TOrdersListState = {
  order: null,
  orderNumber: null,
  orders: [],
  orderRequest: false,
  ordersRequest: false,
  orderError: null,
  ordersError: null
};

const ordersListSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    selectOrdersList: (sliceState) => sliceState.orders,
    selectViewOrder: (sliceState) => sliceState.order,
    selectViewOrderError: (sliceState) => sliceState.orderError,
    selectViewOrderNumber: (sliceState) => sliceState.orderNumber,
    selectViewOrderLoading: (sliceState) => sliceState.orderRequest,
    selectOrdersListLoading: (sliceState) => sliceState.ordersRequest,
    selectOrdersListError: (sliceState) => sliceState.orderError
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.ordersRequest = true;
        state.ordersError = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.ordersRequest = false;
        state.ordersError = action.error;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.ordersRequest = false;
        state.orders = action.payload;
      });
    builder
      .addCase(viewOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(viewOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(viewOrderThunk.fulfilled, (state, action) => {
        state.ordersRequest = false;
        state.order =
          action.payload.orders.length > 0 ? action.payload.orders[0] : null;
        state.orderNumber = action.payload.orders[0].number;
        console.log(action.payload.orders[0]);
      });
  }
});

export default ordersListSlice.reducer;

export const {
  selectOrdersList,
  selectViewOrder,
  selectViewOrderLoading,
  selectOrdersListLoading,
  selectViewOrderNumber
} = ordersListSlice.selectors;
//export const {  } = ordersListSlice.actions;
