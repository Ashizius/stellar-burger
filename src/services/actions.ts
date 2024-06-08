import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from '../utils/cookie';
import {
  logout,
  setAuthChecked,
  setSending,
  setUser,
  setUserAuthError
} from './slices/userSlice';
import { TBurger } from './slices/burgerConstructorSlice';

export const getUserThunk = createAsyncThunk(
  'user/getUserByToken',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(setSending(true));
      dispatch(setUserAuthError(null));
      return getUserApi()
        .then((data) => {
          dispatch(setUser(data.user));
        })
        .catch((error) => {
          dispatch(setUserAuthError(error));
          dispatch(logout());
        })
        .finally(() => {
          dispatch(setAuthChecked());
          dispatch(setSending(false));
        });
    } else {
      dispatch(setAuthChecked());
      dispatch(setUserAuthError(null));
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async ({ name, email, password }: TRegisterData) =>
    await registerUserApi({ name, email, password })
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) =>
    await loginUserApi({ email, password })
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const logoutThunk = createAsyncThunk(
  'user/logoutUser',
  async () => await logoutApi()
);

export const getFeedsThunk = createAsyncThunk('feeds/get', async () => {
  const ingredients = await getFeedsApi();
  return ingredients;
});

export const getIngredientsThunk = createAsyncThunk('user/get', async () => {
  const ingredients = await getIngredientsApi();
  return ingredients;
});

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

export const viewOrderThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  async (id: number) => await getOrderByNumberApi(id)
);

export const getOrdersThunk = createAsyncThunk(
  'orders/getAll',
  async () => await getOrdersApi()
);
