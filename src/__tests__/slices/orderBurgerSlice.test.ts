import * as actionsApi from '../../services/actions';
import store from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

import reducer from '../../services/slices/orderBurgerSlice';
import * as sliceApi from '../../services/slices/orderBurgerSlice';
import mockData from '../orderBurger.json';
import mockBurgerData from '../burger.json';
import * as cookies from '../../utils/cookie';

import unsuccessResponse from '../unsuccessResponse.json'
const globalFetch = global.fetch;
afterAll(() => {
  global.fetch = globalFetch;
});
const initialState = sliceApi.initialState;

const { success, name, ...expectedResult } = mockData;
const testedThunk = actionsApi.orderBurgerThunk;
const getCurrentStorePart = () => store.getState().orderBurger;
const loadingState = Object.assign({}, initialState, { orderRequest: true });
const fulfilledState = Object.assign({}, initialState);
const appliedState = Object.assign({}, fulfilledState, expectedResult);
const failedState = Object.assign({}, fulfilledState, {
  orderError: unsuccessResponse
});

const burger = mockBurgerData.burger;

describe('Заказ бургера. Тест:', () => {
  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(initialState, testedThunk.pending('', burger));
    expect(newState).toEqual(loadingState);
  });
  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(mockData, '', burger)
    );
    expect(newState).toEqual(appliedState);
  });
  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '', burger)
    );
    expect(newState).toEqual(failedState);
  });

  test('[#4]. очистка заказа', () => {
    const newState = reducer(appliedState, sliceApi.clearOrder());
    expect(newState).toEqual(initialState);
  });

  test('[#5]. успешный диспатч', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    ) as jest.Mock;
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk(burger));
    expect(getCurrentStorePart()).toEqual(appliedState);
  });
  test('[#6]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk(burger));
    expect(getCurrentStorePart()).toEqual(failedState);
  });
});
