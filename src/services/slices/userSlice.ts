import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  loginUserThunk,
  logoutThunk,
  registerUserThunk,
  updateUserThunk
} from '../actions';

export interface UserState {
  isSending: boolean;
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  data: TUser | null;
  authUserError: SerializedError | null;
  formError: SerializedError | null;
}

export const initialState: UserState = {
  isSending: false,
  isAuthChecked: false,
  data: null,
  authUserError: null,
  formError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSending: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.data = action.payload;
    },
    setUserAuthError: (
      state,
      action: PayloadAction<SerializedError | null>
    ) => {
      state.authUserError = action.payload;
    },
    logout: (state) => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      state.data = null;
    }
  },
  selectors: {
    selectUserData: (state) => state.data,
    selectUserSending: (state) => state.isSending,
    selectUserAuthChecked: (state) => state.isAuthChecked,
    selectUserAuthError: (state) => state.authUserError,
    selectFormError: (state) => state.formError
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isSending = false;
      state.formError = action.error;
      state.data = null;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isSending = false;
      setCookie('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.data = action.payload.user;
    });
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isSending = false;
      state.formError = action.error;
      state.data = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isSending = false;
      setCookie('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.data = action.payload.user;
    });
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isSending = false;
      state.formError = action.error;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.isSending = false;
      state.data = action.payload.user;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.formError = action.error;
      state.isSending = false;
      state.data = null;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isSending = false;
      state.data = null;
      state.isAuthChecked = true;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  }
});
export const { setAuthChecked, setUser, setUserAuthError, logout, setSending } =
  userSlice.actions;
export const {
  selectUserData,
  selectUserSending,
  selectUserAuthError,
  selectFormError,
  selectUserAuthChecked
} = userSlice.selectors;
export default userSlice.reducer;
