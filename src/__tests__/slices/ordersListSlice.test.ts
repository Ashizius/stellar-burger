import * as actionsApi from '../../services/actions';
import store from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

import reducer from '../../services/slices/ordersListSlice';
import * as sliceApi from '../../services/slices/ordersListSlice';
import mockData from '../feeds.json';
import * as cookies from '../../utils/cookie';

import unsuccessResponse from '../unsuccessResponse.json';
const globalFetch = global.fetch;
afterAll(() => {
  global.fetch = globalFetch;
});
const initialState = sliceApi.initialState;

describe('Список заказов. Тест:', () => {
  const { success, total, totalToday, ...expectedResult } = mockData;
  const thunkPayload = mockData.orders;
  const testedThunk = actionsApi.getOrdersThunk;
  const getCurrentStorePart = () => store.getState().orders;
  const loadingState = Object.assign({}, initialState, { ordersRequest: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    ordersError: unsuccessResponse
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
        json: () => Promise.resolve(mockData)
      })
    ) as jest.Mock;
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk());
    const { orders, ordersRequest, ordersError } = getCurrentStorePart();
    expect(ordersRequest).toBe(false);
    expect(ordersError).toBe(null);
    expect(orders).toEqual(appliedState.orders);
  });

  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk());
    const { orders, ordersRequest, ordersError } = getCurrentStorePart();
    expect(ordersRequest).toBe(false);
    expect(orders).toEqual([]);
    expect(ordersError).toEqual(failedState.ordersError);
  });
});

describe('Заказ №40807. Тест:', () => {
  const expectedResult = {
    order: mockData.orders[0],
    orderNumber: mockData.orders[0].number
  };
  const thunkPayload = mockData;
  const testedThunk = actionsApi.viewOrderThunk;
  const getCurrentStorePart = () => store.getState().orders;
  const loadingState = Object.assign({}, initialState, { orderRequest: true });
  const fulfilledState = Object.assign({}, initialState);
  const appliedState = Object.assign({}, fulfilledState, expectedResult);
  const failedState = Object.assign({}, fulfilledState, {
    orderError: unsuccessResponse
  });

  test('[#1]. Запрос на эндпоинт', async () => {
    const newState = reducer(initialState, testedThunk.pending('', 40807));
    expect(newState).toEqual(loadingState);
  });

  test('[#2]. Результат запроса', async () => {
    const newState = reducer(
      loadingState,
      testedThunk.fulfilled(thunkPayload, '', 40807)
    );
    expect(newState).toEqual(appliedState);
  });

  test('[#3]. Ошибка запроса', () => {
    const newState = reducer(
      loadingState,
      testedThunk.rejected(unsuccessResponse, '', 40807)
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
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk(40807));
    const { order, orderRequest, orderError } = getCurrentStorePart();
    expect(orderRequest).toBe(false);
    expect(orderError).toBe(null);
    expect(order).toEqual(appliedState.order);
  });

  test('[#5]. ошибка загрузки с сервера', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(unsuccessResponse)
      })
    ) as jest.Mock;
    jest.spyOn(cookies, 'getCookie').mockImplementation((text) => '123456');
    await store.dispatch(testedThunk(40807));
    const { order, orderRequest, orderError } = getCurrentStorePart();
    expect(orderRequest).toBe(false);
    expect(order).toBe(null);
    expect(orderError).toEqual(failedState.orderError);
  });
});
