import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isLoading: boolean;
  isSending: boolean;
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  data: TUser | null;
  authUserError: SerializedError | null;
  formError: SerializedError | null;
}

const initialState: UserState = {
  isLoading: false,
  isSending: false,
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  //  loginUserError: null,
  authUserError: null,
  formError: null
};

/*
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
); //dispatch(loginUser({email:'',password:''}));
*/
export const getUserThunk = createAsyncThunk(
  'user/getUserByToken',
  async () => await getUserApi()
);

export const logoutThunk = createAsyncThunk(
  'user/logoutUser',
  async () => await logoutApi()
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUserData: (state) => state.data,
    selectUserLoading: (state) => state.isLoading,
    selectUserSending: (state) => state.isSending,
    selectUserAuthenticated: (state) => state.isAuthenticated,
    selectUserAuthChecked: (state) => state.isAuthChecked,
    selectUserAuthError: (state) => state.authUserError,
    selectFormError: (state) => state.formError
  },
  extraReducers: (builder) => {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
      state.isAuthChecked = false;
      state.isAuthenticated = false;
      state.authUserError = null;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.isAuthenticated = false;
      state.data = null;
      console.log('rejected');
      state.authUserError = action.error;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
      console.log('fulfilled');
      state.data = action.payload.user;
    });
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isSending = false;
      state.formError = action.error;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isSending = false;
      setCookie('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.data = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isSending = false;
      state.isAuthenticated = false;
      state.formError = action.error;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isSending = false;
      state.isAuthenticated = true;
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
      state.isAuthenticated = true;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.isSending = true;
      state.formError = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.isSending = false;
      state.formError = action.error;
    });
    builder.addCase(logoutThunk.fulfilled, (state, action) => {
      state.isSending = false;
      state.data = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  }
});
export const { authChecked } = userSlice.actions;
export const {
  selectUserData,
  selectUserLoading,
  selectUserSending,
  selectUserAuthenticated,
  selectUserAuthError,
  selectFormError,
  selectUserAuthChecked
} = userSlice.selectors;
export default userSlice.reducer;

/*
isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false;
  data: null,
  loginUserError: null,
  loginUserRequest: false,
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password }, {rejectWithValue})
        if (!data?.success) {
                return rejectWithValue(data);
        }
        setCookie('accessToken', data.accessToken);
        localSotrage.setItem('refreshToken', data.refreshToken);
        return data.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
    extraReducers: (builder) => {
      builder
            .addCase(loginUser.pending, (state) => {
          state.loginUserRequest = true;
          state.loginUserError = null;
            })
      .addCase(loginUser.rejected, (state, action) => {
            state.loginUserRequest = false;
          state.loginUserError = action.payload;
          state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
              state.data = action.payload.user;
          state.loginUserRequest = false;
                state.isAuthenticated = true;
          state.isAuthChecked = true;
      }
*/
