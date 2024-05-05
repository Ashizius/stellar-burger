import { getOrderByNumberApi, getOrdersApi } from '@api';
import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const viewOrderThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  async (id: number) => await getOrderByNumberApi(id)
);

export const getOrdersThunk = createAsyncThunk(
  'orders/getAll',
  async () => await getOrdersApi()
);

interface TOrdersListState {
  order: TOrder | null;
  orders: TOrder[];
  orderRequest: boolean;
  ordersRequest: boolean;
  ordersError: SerializedError | null;
  orderError: SerializedError | null;
}

const initialState: TOrdersListState = {
  order: null,
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
    selectOrdersListError: (sliceState) => sliceState.orderError
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state, action) => {
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
      .addCase(viewOrderThunk.pending, (state, action) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(viewOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(viewOrderThunk.fulfilled, (state, action) => {
        state.ordersRequest = false;
        console.log(action.payload.orders);
        state.order =
          action.payload.orders.length > 0 ? action.payload.orders[0] : null;
      });
  }
});

export default ordersListSlice.reducer;

export const { selectOrdersList, selectViewOrder } = ordersListSlice.selectors;
//export const {  } = ordersListSlice.actions;