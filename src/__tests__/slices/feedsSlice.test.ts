import * as actionsApi from '../../services/actions';
import store from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

import reducer from '../../services/slices/feedsSlice';
import * as sliceApi from '../../services/slices/feedsSlice';
import mockData from '../feeds.json';

const unSuccessResponse = { message: 'ошибка', name: 'ошибка' };
const globalFetch = global.fetch;
afterAll(() => {
  global.fetch = globalFetch;
});
const initialState = sliceApi.initialState;

const { success, ...expectedResult } = mockData;
const testedThunk = actionsApi.getFeedsThunk;
const getCurrentStorePart = () => store.getState().feeds;
const loadingState = Object.assign({}, initialState, { isLoading: true });
const fulfilledState = Object.assign({}, initialState, { isInit: true });
const appliedState = Object.assign({}, fulfilledState, expectedResult);
const failedState = Object.assign({}, fulfilledState, {
  error: unSuccessResponse
});

describe('Cлайс с лентой заказов. Тест:', () => {
  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(initialState, testedThunk.pending(''));
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled({ ...expectedResult, success: true }, '')
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unSuccessResponse, '')
    );
    expect(newState).toEqual(failedState);
  });
  test('[#4]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    expect(getCurrentStorePart()).toEqual(appliedState);
  });
  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unSuccessResponse)
      })
    ) as jest.Mock;
    await store.dispatch(testedThunk());
    expect(getCurrentStorePart()).toEqual(failedState);
  });
});
