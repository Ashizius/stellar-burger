import { orderBurgerApi } from '@api';
import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TBurger } from './burgerConstructorSlice';
import { TOrder } from '@utils-types';

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

export const orderBurgerThunk = createAsyncThunk(
  'orderBurger/burger',
  async (burger: TBurger) => {
    const ingredientsIds = burger.ingredients.map(
      (ingredient) => ingredient._id
    );
    burger.bun ? ingredientsIds.push(burger.bun._id, burger.bun._id) : null;
    const order = await orderBurgerApi(ingredientsIds);
    return order;
  }
);

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
