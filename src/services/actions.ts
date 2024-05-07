import { getUserApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from '../utils/cookie';
import { setAuthChecked, setUser, setUserAuthError } from './slices/userSlice';

export const getUserThunk = createAsyncThunk(
  'user/getUserByToken',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      console.log('token');
      getUserApi()
        .then((data) => {
          console.log('user:', data.user);
          dispatch(setUser(data.user));
        })
        .catch((error) => {
          dispatch(setUserAuthError(error));
        })
        .finally(() => {
          console.log('finally');
          dispatch(setAuthChecked());
        });
    } else {
      console.log('noToken');
      dispatch(setAuthChecked());
    }
  }
);
