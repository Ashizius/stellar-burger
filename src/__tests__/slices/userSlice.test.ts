import * as actionsApi from '../../services/actions';
import store from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

import reducer from '../../services/slices/userSlice';
import * as sliceApi from '../../services/slices/userSlice';
import mockData from '../user.json';
import * as cookies from '../../utils/cookie';

import unsuccessResponse from '../unsuccessResponse.json'
const globalFetch = global.fetch;
const globallocalStorage = global.localStorage;
afterAll(() => {
  global.fetch = globalFetch;
  global.localStorage = globallocalStorage;
});
const initialState = sliceApi.initialState;

beforeEach(() => {
  jest.spyOn(cookies, 'setCookie').mockImplementation((text) => null);
  jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
  jest.spyOn(cookies, 'deleteCookie').mockImplementation((text) => null);
  global.localStorage = Object.assign({}, global?.localStorage, {
    removeItem: jest.fn((text) => null),
    setItem: jest.fn((text, value: string) => null),
    getItem: jest.fn((text, value: string) => '654321')
  });
});
describe('Получение пользователя по токену. Тест:', () => {
  const expectedResult = { data: mockData.user };
  const thunkPayload = mockData.response;
  const testedThunk = actionsApi.registerUserThunk;
  const getCurrentStorePart = () => store.getState().user;
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    formError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    const pendingThunk = store.dispatch(actionsApi.getUserThunk());
    const { isSending } = getCurrentStorePart();
    expect(isSending).toBe(true);
    await pendingThunk;
  });
  test('[#2]. Результат запроса', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    await store.dispatch(actionsApi.getUserThunk());
    const { isSending, data } = getCurrentStorePart();
    expect(isSending).toBe(false);
    expect(data).toEqual(mockData.response.user);
  });
  test('[#3]. Ошибка запроса', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(actionsApi.getUserThunk());
    const { isSending, data, authUserError } = getCurrentStorePart();
    expect(isSending).toBe(false);
    expect(data).toBe(null);
    expect(authUserError).toEqual(unsuccessResponse);
  });
  test('[#4]. Отсутствие токена', async () => {
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => undefined);
    global.localStorage = Object.assign({}, global?.localStorage, {
      removeItem: jest.fn((text) => null),
      setItem: jest.fn((text, value: string) => null),
      getItem: jest.fn((text, value: string) => undefined)
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    await store.dispatch(actionsApi.getUserThunk());
    const { isSending, data, authUserError } = getCurrentStorePart();
    expect(isSending).toBe(false);
    expect(data).toBe(null);
    expect(authUserError).toBe(null);
  });
});

describe('Регистрация пользователя. Тест:', () => {
  const expectedResult = { data: mockData.user };
  const thunkPayload = mockData.response;
  const testedThunk = actionsApi.registerUserThunk;
  const getCurrentStorePart = () => store.getState().user;
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    formError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(
      initialState,
      testedThunk.pending('', mockData.login)
    );
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(thunkPayload, '', mockData.login)
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '', mockData.login)
    );
    expect(newState).toEqual(failedState);
  });
  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(data).toEqual(appliedState.data);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
    expect(formError).toBe(null);
  });
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    expect(getCurrentStorePart().formError).toEqual(failedState.formError);
  });
});

describe('логин пользователя. Тест:', () => {
  const expectedResult = { data: mockData.user };
  const thunkPayload = mockData.response;
  const testedThunk = actionsApi.loginUserThunk;
  const getCurrentStorePart = () => store.getState().user;
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    formError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(
      initialState,
      testedThunk.pending('', mockData.login)
    );
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(thunkPayload, '', mockData.login)
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '', mockData.login)
    );
    expect(newState).toEqual(failedState);
  });
  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(data).toEqual(appliedState.data);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
    expect(formError).toBe(null);
  });
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(formError).toEqual(failedState.formError);
    expect(data).toBe(null);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
  });
});

describe('обновление пользователя. Тест:', () => {
  const expectedResult = { data: mockData.user };
  const thunkPayload = mockData.response;
  const testedThunk = actionsApi.updateUserThunk;
  const getCurrentStorePart = () => store.getState().user;
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    formError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(
      initialState,
      testedThunk.pending('', mockData.login)
    );
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(thunkPayload, '', mockData.login)
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '', mockData.login)
    );
    expect(newState).toEqual(failedState);
  });
  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData.response)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(data).toEqual(appliedState.data);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
    expect(formError).toBe(null);
  });
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk(mockData.login));
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(formError).toEqual(failedState.formError);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
  });
});

describe('выход пользователя. Тест:', () => {
  const expectedResult = { data: null };
  const thunkPayload = mockData.response;
  const testedThunk = actionsApi.logoutThunk;
  const getCurrentStorePart = () => store.getState().user;
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult, {
    isAuthChecked: true
  });
  const failedState = Object.assign({}, fulfilledState, {
    formError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(initialState, testedThunk.pending(''));
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(thunkPayload, '')
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '')
    );
    expect(newState).toEqual(failedState);
  });
  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(data).toBe(null);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
    expect(formError).toBe(null);
  });
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    const { data, isAuthChecked, isSending, formError } = getCurrentStorePart();
    expect(formError).toEqual(failedState.formError);
    expect(data).toBe(null);
    expect(isAuthChecked).toBe(true);
    expect(isSending).toBe(false);
  });
});

describe('редьюсеры пользователя. Тест:', () => {
  const expectedResult = { data: mockData.user };
  const loadingState = Object.assign({}, initialState, { isSending: true });
  const authenticatedState = Object.assign({}, initialState, {
    isAuthChecked: true
  });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    authUserError: unsuccessResponse
  });

  test('[#1]. редьюсер отправки данных', () => {
    const newState = reducer(initialState, sliceApi.setSending(true));
    expect(newState).toEqual(loadingState);
  });

  test('[#2]. редьюсер аутентификации', () => {
    const newState = reducer(initialState, sliceApi.setAuthChecked());
    expect(newState).toEqual(authenticatedState);
  });

  test('[#3]. редьюсер назначения данных', () => {
    const newState = reducer(initialState, sliceApi.setUser(mockData.user));
    expect(newState).toEqual(appliedState);
  });

  test('[#4]. редьюсер ошибки аутентификации', () => {
    const newState = reducer(
      initialState,
      sliceApi.setUserAuthError(unsuccessResponse)
    );
    expect(newState).toEqual(failedState);
  });

  test('[#5]. редьюсер выхода пользователя', () => {
    const newState = reducer(appliedState, sliceApi.logout());
    expect(newState).toEqual(initialState);
  });
});
