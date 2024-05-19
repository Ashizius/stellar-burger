import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import ingredients from './slices/ingredientsSlice';
import feeds from './slices/feedsSlice';
import burgerConstructor from './slices/burgerConstructorSlice';
import orderBurger from './slices/orderBurgerSlice';
import orders from './slices/ordersListSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  user,
  ingredients,
  feeds,
  burgerConstructor,
  orderBurger,
  orders
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
